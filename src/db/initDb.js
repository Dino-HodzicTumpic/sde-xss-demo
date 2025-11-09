import { pool } from "./pool.js";

export const initDb = async () => {
  try {
    await pool.query(
      `
       DROP TABLE IF EXISTS sensitive_data;
       
      CREATE TABLE IF NOT EXISTS guestbook (
       id SERIAL PRIMARY KEY,
       message TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT NOW()
      );

       CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
      
       `
    );

    console.log("Database initialized successfully");
  } catch (err) {
    console.log("Error initializing database:", err);
  }
};
