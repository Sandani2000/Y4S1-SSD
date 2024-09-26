const express = require("express");
const router = express.Router();
const {
  addPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
} = require("../controllers/paymentController");

const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

// Routes for CRUD operations
router.post("/", csrfProtection, addPayment);
router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.put("/:id", csrfProtection, updatePaymentById);
router.delete("/:id", csrfProtection, deletePaymentById);

module.exports = router;
