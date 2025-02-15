const express = require("express");
const app = require("./src/app"); // Import app setup
const path = require("path");
const port = process.env.PORT || 3000;

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
