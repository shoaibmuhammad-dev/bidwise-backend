const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_PRODUCTION],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  }),
);

const analysisRoutes = require("./modules/analyzer/routes");
const feebackRoutes = require("./modules/feedback/feedback.routes");
const contactRoutes = require("./modules/contact/contact.routes");

app.use("/api", analysisRoutes);
app.use("/api/feedback", feebackRoutes);
app.use("/api/contact", contactRoutes);

app.use("/", (req, res) => {
  res.send("Server is running");
});

// 404 error handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use(require("./middleware/errorMiddleware"));

module.exports = app;
