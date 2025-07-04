import express, { urlencoded } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // to parse req.body
app.use(urlencoded({ extended: true })); // to parse from data {urlencoded}

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send(`Server is ready`);
});

app.listen(PORT, () => {
  console.log(`Server is running at  http://localhost:${PORT}`);
  connectMongoDB();
});
