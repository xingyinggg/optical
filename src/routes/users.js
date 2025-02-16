const express = require("express");
const router = express.Router();
const users = require("../data/userData");

/**
 * GET /users
 * Query Params:
 * - min (minimum salary)
 * - max (maximum salary)
 * - offset (pagination start)
 * - limit (number of results)
 * - sort (name or salary, ascending only)
 */


router.get("/", (req, res) => {
  console.log("Current Users Data:", users);  // Debugging
  try {
    let { min, max, offset, limit, sort } = req.query;

    // console.log(`Received API Request: min=${min}, max=${max}, offset=${offset}, limit=${limit}, sort=${sort}`);


    // Convert query params to appropriate types with defaults
    min = min ? parseFloat(min) : 0;
    max = max ? parseFloat(max) : 4000;
    offset = offset ? parseInt(offset) : 0;
    limit = limit ? parseInt(limit) : undefined;

    // Filter users based on min/max salary
    let filteredUsers = users

    if (min !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.salary >= min);
    }

    if (max !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.salary <= max);
    }

    // Sorting logic
    if (sort) {
      if (sort === "name") {
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === "salary") {
        filteredUsers.sort((a, b) => a.salary - b.salary);
      } else {
        return res.status(400).json({ error: "Invalid sort parameter. Use 'name', 'salary'." });
      }
    }

    // Apply pagination
    let paginatedUsers = filteredUsers.slice(offset, limit ? offset + limit : undefined);

    // console.log("Returning users: ", paginatedUsers);

    res.json({ results: paginatedUsers });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
