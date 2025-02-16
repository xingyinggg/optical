const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const crypto = require('crypto');

// import user data model
const users = require("../data/userData");

// mutex implementation for atomic updates
const mutex = {
  locked: false,
  queue: [],
  lock: function() {
    return new Promise((resolve) => {
      if (!this.locked) {
        this.locked = true;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  },
  unlock: function() {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.locked = false;
    }
  }
};

// configure multer with dynamic destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('uploads', crypto.randomBytes(8).toString('hex'));
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'data.csv');
  }
});

// create multer instance that accepts either 'file' or 'files' field
const upload = multer({ storage }).fields([
  { name: 'file', maxCount: 5 },
  { name: 'files', maxCount: 5 }
]);

async function processCSVFile(filePath) {
  const newUsers = [];
  const seenNames = new Set();

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.toUpperCase()
      }))
      .on("headers", (headers) => {
        if (headers.length !== 2) {
          reject(new Error('CSV must contain exactly 2 columns: NAME and SALARY'));
        }
        
        const requiredHeaders = ['NAME', 'SALARY'];
        const actualHeaders = headers.map(h => h.toUpperCase());
        if (!requiredHeaders.every(h => actualHeaders.includes(h))) {
          reject(new Error('CSV must contain NAME and SALARY columns'));
        }
      })
      .on("data", (row) => {
        if (Object.keys(row).length !== 2) {
          reject(new Error('Each row must contain exactly 2 columns'));
        }

        const name = row.NAME.trim();
        const salary = parseFloat(row.SALARY);

        if (isNaN(salary)) {
          reject(new Error(`Invalid salary format for user ${name}`));
        }

        if (salary < 0) {
          return;
        }

        if (seenNames.has(name)) {
          reject(new Error(`Duplicate name found in upload: ${name}`));
        }

        seenNames.add(name);
        newUsers.push({ name, salary });
      })
      .on("end", () => resolve())
      .on("error", reject);
  });

  if (newUsers.length === 0) {
    throw new Error('No valid users found in CSV');
  }

  return newUsers;
}

router.post("/", upload, async (req, res) => {
  // declare uploadedFiles outside try block so it's accessible in finally
  let uploadedFiles = [];
  let uploadDirs = [];
  
  try {
    // get all uploaded files from either field
    uploadedFiles = [
      ...(req.files?.file || []),
      ...(req.files?.files || [])
    ];

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ 
        success: 0, 
        error: "No files uploaded" 
      });
    }

    uploadDirs = uploadedFiles.map(file => path.dirname(file.path));
    const allNewUsers = [];
    
    // process file
    for (const file of uploadedFiles) {
      try {
        const fileUsers = await processCSVFile(file.path);
        allNewUsers.push(...fileUsers);
      } catch (error) {
        throw new Error(`Error processing ${file.originalname}: ${error.message}`);
      }
    }

    // acquire mutex lock for atomic update
    await mutex.lock();

    try {
      // create a map of existing users
      const existingUserMap = new Map(
        users.map(user => [user.name, user])
      );

      // merge users
      const mergedUsers = [];
      const processedNames = new Set();

      // add all new users
      for (const newUser of allNewUsers) {
        mergedUsers.push(newUser);
        processedNames.add(newUser.name);
      }

      // add remaining existing users
      for (const [name, user] of existingUserMap) {
        if (!processedNames.has(name)) {
          mergedUsers.push(user);
        }
      }

      // perform atomic update
      users.length = 0;
      users.push(...mergedUsers);

      res.status(200).json({ success: 1 });
    } finally {
      mutex.unlock();
    }
  } catch (error) {
    res.status(400).json({ 
      success: 0, 
      error: error.message 
    });
  } finally {
    // clean up upload directories
    for (const dir of uploadDirs) {
      try {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true });
        }
      } catch (cleanupError) {
        console.error('Error cleaning up upload directory:', cleanupError);
      }
    }
  }
});

module.exports = router;