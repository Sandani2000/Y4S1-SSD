const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf"); // CSRF middleware
const cookieParser = require("cookie-parser"); // Required for storing CSRF token in cookies

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Fix1 - Use helmet to secure HTTP headers
app.use(helmet());

app.use(cookieParser());

// Allow CORS
const corsOptions = {
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));

// Serve static files
app.use("/Lectures", express.static("Lectures"));
app.use("/Videos", express.static("Videos"));
app.use("/Preview", express.static("Preview"));

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Fix2 - CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Route to provide CSRF token (for frontend to fetch and use)
app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes for Course Management
const courseRoutes = require("./routes/courseRoutes");
app.use("/api/v1/course", courseRoutes);

// Listen on port
const port = process.env.PORT || 4003;
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan
      .white
  );
});
