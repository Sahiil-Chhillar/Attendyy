import dotenv from "dotenv";
dotenv.config();

import path from 'path';
const __dirname = path.resolve();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/UserRoutes.js";
import SessionRoutes from "./routes/SessionRoutes.js";
import connectDB from "./middleware/DBconnect.js";

const app = express();
const PORT = process.env.PORT || 5050;


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
// app.use(express.static("public"));

connectDB();

app.use("/users", userRoutes);
app.use("/sessions", SessionRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", 'index.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
