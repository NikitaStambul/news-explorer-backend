import express from "express";
import helmet from "helmet";
import cors from "cors";
import connectDB from "#config/db";
import router from "#routes/index";
import { HOST, PORT } from "#utils/config";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(router);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
