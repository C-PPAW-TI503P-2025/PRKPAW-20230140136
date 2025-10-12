const express = require("express");
const booksRoutes = require("./routes/books");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

// Middleware untuk parsing JSON body
app.use(express.json());

// Middleware Logging
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// Routing utama
app.use("/api/books", booksRoutes);

// Middleware untuk 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: "404 Not Found" });
});

// Middleware Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
