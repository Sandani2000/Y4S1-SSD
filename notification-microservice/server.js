const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Required for storing CSRF token in cookies
const csrf = require("csurf"); // CSRF middleware

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
app.use(cors());

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser()); // Add cookie parser

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Route to provide CSRF token (for frontend to fetch and use)
app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes for Notification Management
const courseRoutes = require("./routes/notificationRoutes");
app.use("/api/v1/notification/", courseRoutes);

// Listen on port
const port = process.env.PORT || 4004;
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan
      .white
  );
});
