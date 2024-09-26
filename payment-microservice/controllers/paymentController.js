const Payment = require("../models/paymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const {body, validationResult} = require("express-validator");

// Add Payment with validation
const addPayment = async (req, res) => {
  const {items} = req.body;
  const currency = "lkr";

  // Validate the incoming items object
  if (!items || !Array.isArray(items.products)) {
    return res
      .status(400)
      .json({error: "Invalid input: products must be an array."});
  }

  // Ensure that each product has the necessary properties
  for (let product of items.products) {
    if (
      typeof product.name !== "string" ||
      typeof product.price !== "number" ||
      !Array.isArray(product.images) ||
      typeof product.quantity !== "number"
    ) {
      return res.status(400).json({error: "Invalid product data format."});
    }
  }

  try {
    // Create a new Checkout Session with validated data
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "http://localhost:3000/enroll/success",
      cancel_url: "http://localhost:3000/enroll/unsuccess",
      line_items: items.products.map((product) => ({
        price_data: {
          currency,
          product_data: {
            name: product.name,
            images: [product.images[0]],
          },
          unit_amount: product.price * 100, // amount in cents
        },
        quantity: product.quantity,
      })),
    });

    res.json({url: session.url});
  } catch (error) {
    console.error("Error creating checkout payment:", error);
    res
      .status(500)
      .json({error: "An error occurred while creating checkout session."});
  }
};

// Get all Payments
const getAllPayments = async (req, res) => {
  console.log("get all payments");
};

// Get Payment by ID
const getPaymentById = async (req, res) => {
  console.log("get payment by id");
};

// Update Payment by ID
const updatePaymentById = async (req, res) => {
  console.log("update payment by id");
};

// Delete Payment by ID
const deletePaymentById = async (req, res) => {
  console.log("delete payment");
};

module.exports = {
  addPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
};
