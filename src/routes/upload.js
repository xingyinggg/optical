const express = require("express");
const router = express.Router();

// Dummy POST /upload endpoint
router.post("/", (req, res) => {
  res.json({ success: 1 });
});

module.exports = router;
