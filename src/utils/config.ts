import dotenv from "dotenv";
dotenv.config();

export const {
  JWT_SECRET = "supersecretstring",
  NEWS_API_KEY = "",
  NEWS_API_URL = "",
  PORT = 3001,
  HOST = "localhost",
} = process.env;
