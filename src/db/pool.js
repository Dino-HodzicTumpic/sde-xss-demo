import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "mydb_nepk",
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: true,
});
