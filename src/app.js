const express = require("express");
const usersRoutes = require("./routes/users");
const uploadRoutes = require("./routes/upload");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/users", usersRoutes);
app.use("/upload", uploadRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
