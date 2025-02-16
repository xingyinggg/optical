const express = require("express");
const usersRoutes = require("./routes/users");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(express.json()); 

// Routes
app.use("/users", usersRoutes);
app.use("/upload", uploadRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
