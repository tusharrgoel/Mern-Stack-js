import { connectToMongo } from "./db.js";
import express from "express";

const app = express();
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
connectToMongo();
app.use(express.json());
dotenv.config();

//Available Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to my Project");
});

app.listen(process.env.PORT, () => {
  console.log(`Connected to port ${process.env.PORT}`);
});
