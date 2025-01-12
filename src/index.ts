import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import connectDB from "@config/db";
import router from "@routes/index";

dotenv.config();
const { PORT = 3001, HOST = "localhost" } = process.env;

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(router);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
