# Lau Xing Ying SWE Take Home Assignment

This is a simple Express-based API that allows users to:

- Retrieve user data with various filters and sorting options (`/users`).
- Upload a CSV file to update user data (`/upload`).

---

## **🛠️ Setup Instructions**

### **1️⃣ Install Dependencies**

Ensure you have Node.js installed, then run:

```sh
npm install
2️⃣ Start the Server
Run the server using:

sh
Copy
Edit
npm start
By default, the API will run on http://localhost:3000/.

📝 API Endpoints & Testing (Postman)
1️⃣ GET /users - Fetch Users
This endpoint returns a list of users with optional filtering and sorting.

🔹 Query Parameters
    => min
    => max
    => offset
    => limit
    => sort (by 'NAME' or 'SALARY')

2️⃣ POST /upload - Upload CSV
This endpoint allows users to upload a CSV file to update the database.

📌 CSV Format
    => Required headers: Name, Salary
    => Salary must be ≥ 0.0 (rows with < 0.0 will be ignored).
    => Duplicate names overwrite existing users.
    => Formatting errors cause entire file to be rejected.

✅ Testing Steps (Postman)
    1. Open Postman, select POST request.
    2. Enter URL: http://localhost:3000/upload
    3. Go to Body → form-data
    4a. For single file upload:
        Key: file
        Type: File
        Value: Choose a valid CSV file
    4b. For multiple files (2-5 files at once):
        Use keys like file1, file2, ..., file5 and set type to File.
    5. Click Send.

💻 Technologies Used
Node.js - Backend framework.
Express.js - API routing.
Multer - File upload handling.
CSV Parser - Reading CSV files.
```
