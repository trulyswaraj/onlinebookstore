const express = require("express");
const mongoose = require("mongoose");
const app = express();

// ✅ Middleware to parse JSON requests
app.use(express.json()); 

// ✅ Middleware for URL-encoded form data (optional)
app.use(express.urlencoded({ extended: true }));

// Import user routes
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
