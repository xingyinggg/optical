# Lau Xing Ying SWE Take Home Assignment

This is a simple Express-based API that allows users to:

- Retrieve user data with various filters and sorting options (`/users`).
- Upload a CSV file to update user data (`/upload`).

## 🏗️ Code Structure
```
optical/
├── node_modules/
├── public/
│   ├── users.html (simple frontend to test /users)
└── src/
    ├── data/
    │   ├── userData.js (mock data for /users)
    ├── models/
    │   ├── userModel.js
    ├── routes/
    │   ├── upload.js 
    │   ├── users.js
    │   ├── app.js
├── uploads/
    ├── file.csv (csv file for /upload)
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

## **🛠️ Setup Instructions**


### **1️⃣ Install Dependencies**

Ensure you have Node.js installed, then run:
- npm install

  
### **2️⃣ Start the Server**

Run the server using:
- npm start
By default, the API will run on http://localhost:3000/.

📝 API Endpoints & Testing (Postman)

### GET /users - Fetch Users
This endpoint returns a list of users with optional filtering and sorting.

🔹 Query Parameters

- min
- max
- offset
- limit
- sort (by 'NAME' or 'SALARY')

✅ Testing Steps (Postman)

1. Open Postman, and select GET request.
2. Enter URL: http://localhost:3000/users
3. (Optional) Add in the respective query parameters.
4. Click Send.


POST /upload - Upload CSV

This endpoint allows users to upload a CSV file to update the database.

📌 CSV Format

- Required headers: Name, Salary
- Salary must be ≥ 0.0 (rows with < 0.0 will be ignored).
- Duplicate names overwrite existing users.
- Formatting errors cause the entire file to be rejected.

✅ Testing Steps (Postman)

1. Open Postman, and select POST request.
2. Enter URL: http://localhost:3000/upload
3. Go to Body → form-data.
4. For single file upload:
  - Key: file 
  - Type: File
  - Value: Choose a valid CSV file
5. For multiple files (2-5 files at once):
    Use keys like file1, file2, ..., file5 and set type to File.
6. Click Send.

💻 Technologies Used

- Node.js - Backend framework.
- Express.js - API routing.
- Multer - File upload handling.
- CSV Parser - Reading CSV files.

