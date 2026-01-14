import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

let dbReady = false;

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Health check endpoint for Kubernetes readiness probe
app.get("/healthz", (req, res) => {
  if (dbReady) {
    res.status(200).send("OK");
  } else {
    res.status(503).send("DB not ready");
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, async () => {
  console.log("server is running on PORT:" + PORT);

  // Retry DB connection every 5 seconds until successful
  const tryConnect = async () => {
    try {
      await connectDB();
      dbReady = true;
      console.log("Database is ready, backend is serving traffic.");
    } catch (err) {
      dbReady = false;
      console.error("Database connection failed, will retry in 5 seconds...");
      setTimeout(tryConnect, 5000);
    }
  };
  tryConnect();
});
