require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PAYMENT_PORT || 5001;

const {connectToDB} = require("./config/db");

// Manually disable the X-Powered-By header
app.disable("x-powered-by");

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); 
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const mongoURL = process.env.PAYMENT_MONGO_URI;

connectToDB(mongoURL)
  .then((client) => {
    app.get("/", (req, res) => {
      res.send("Welcome To Payment-microservice");
    });

    app.use("/api/payment", require("./routes/paymentRoutes"));

    app.get("/test-mongodb", async (req, res) => {
      try {
        const db = client.db(); 
        const collection = db.collection("payments"); 
        const result = await collection.find({}).toArray(); 
        res.json(result); 
      } catch (error) {
        console.error("Error querying MongoDB:", error);
        res.status(500).json({error: "Error querying MongoDB"});
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    // Handle error
    process.exit(1); // Exit the process if MongoDB connection fails
  });
