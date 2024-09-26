require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Required for storing CSRF token in cookies
const csrf = require("csurf"); // CSRF middleware

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Allow CORS
const corsOptions = {
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Route to provide CSRF token (for frontend to fetch and use)
app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Controllers
const dbconfig = require("./config/DBConnect");
const learnerController = require("./controllers/learnerController");
const progressController = require("./controllers/progressController");

// Route handling
app.use("/learner", learnerController);
app.use("/progress", progressController);

// Server setup
const port = process.env.LEARNER_PORT || 4000;
app.listen(port, () =>
  console.log(`Learner server running on http://localhost:${port}`)
);

module.exports = app;
