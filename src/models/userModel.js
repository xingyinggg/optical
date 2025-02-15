const users = require("../data/userData");

/**
 * Get all users with optional filters
 */
const getUsers = ({ min = 0, max = 4000, offset = 0, limit, sort }) => {
  min = parseFloat(min);
  max = parseFloat(max);
  offset = parseInt(offset);
  limit = limit ? parseInt(limit) : undefined;

  let filteredUsers = users.filter(user => user.salary >= min && user.salary <= max);

  // Sorting
  if (sort) {
    if (sort.toLowerCase() === "name") {
      filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort.toLowerCase() === "salary") {
      filteredUsers.sort((a, b) => a.salary - b.salary);
    } else {
      throw new Error("Invalid sort parameter. Use NAME or SALARY.");
    }
  }

  // Apply offset and limit
  return filteredUsers.slice(offset, limit ? offset + limit : undefined);
};

/**
 * Add or Update a User
 */
const upsertUser = (name, salary) => {
  const existingIndex = users.findIndex(user => user.name === name);
  
  if (existingIndex !== -1) {
    users[existingIndex].salary = salary; // Update existing user
  } else {
    users.push({ name, salary }); // Add new user
  }
};

/**
 * Get all users (for debugging/testing)
 */
const getAllUsers = () => users;

module.exports = {
  getUsers,
  upsertUser,
  getAllUsers
};
