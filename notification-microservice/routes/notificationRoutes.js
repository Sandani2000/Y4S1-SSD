const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

// Route for creating a new notification
router.post("/add", csrfProtection, notificationController.createNotification);

module.exports = router;
