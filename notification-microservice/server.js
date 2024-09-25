const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet"); 

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

const courseRoutes = require("./routes/notificationRoutes");
app.use("/api/v1/notification/", courseRoutes);

const port = process.env.PORT || 4004;
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan
      .white
  );
});
