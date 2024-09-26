import { config } from "dotenv";
import express from "express";
import helmet from "helmet"; // Import Helmet middleware
import cookieParser from "cookie-parser"; // Required for storing CSRF token in cookies
import csrf from "csurf"; // CSRF middleware
import { connectDB } from "../configs/DBConnect.js";
import { login, register } from "./controllers/auth.controller.js";

config();

export const authService = express();

// Use Helmet middleware for additional security
authService.use(helmet());

// Use cookie parser
authService.use(cookieParser());

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Middleware to set headers for CORS
authService.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // Allow specified methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token"); // Allow specified headers
  next();
});

authService.use(express.json());

// CSRF token route for frontend to fetch and use
authService.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() }); // Send CSRF token to the client
});

const port = process.env.AUTH_PORT;

// Start the server after connecting to the database
connectDB()
  .then(() => {
    authService.listen(port, () => {
      console.log(`Auth server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

authService.post("/test", (req, res) => {
  console.log(`Received request to auth server from gateway`);
  res.status(200).send("Response from auth server");
});

authService.post("/login", csrfProtection, login);
authService.post("/register", csrfProtection, register);
