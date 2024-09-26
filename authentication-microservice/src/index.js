import { config } from "dotenv";
import { config } from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";
import { connectDB } from "../configs/DBConnect.js";
import { login, register, googleAuthCallback } from "./controllers/auth.controller.js";

config();

export const authService = express();

authService.use(helmet());

authService.use(express.json());

// Session setup for Passport.js
authService.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
authService.use(passport.initialize());
authService.use(passport.session());

// Middleware to set headers for CORS
authService.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const port = process.env.AUTH_PORT;

connectDB()
  .then(() => {
    authService.listen(port, () => {
      console.log(`Auth server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

// Login and Register Routes
authService.post("/login", login);
authService.post("/register", register);

// Google OAuth Routes
authService.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authService.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleAuthCallback);
