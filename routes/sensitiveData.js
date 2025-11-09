import { Router } from "express";
import { pool } from "../src/db/pool.js";
import argon2 from "argon2";

const router = Router();

let insecureMode = true;

router.get("/sde", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, username, password FROM users ORDER BY id DESC"
    );

    const usersDisplay = rows.map((u) => {
      let passwordDisplay;

      if (u.password.startsWith("$argon2")) {
        passwordDisplay = u.password.split("$").at(-1);
      } else {
        passwordDisplay = u.password;
      }

      return {
        ...u,
        passwordDisplay,
      };
    });

    res.render("sde", {
      insecureMode,
      users: usersDisplay,
    });
  } catch (err) {
    console.error("DB error while fetching users:", err);
    res.status(500).send("Database error while fetching users");
  }
});

router.post("/sde-toggle", (req, res) => {
  const { insecure } = req.body;
  insecureMode = !!insecure;
  res.json({ insecureMode });
});

router.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Obavezno username i password" });

    if (insecureMode) {
      await pool.query(
        "INSERT INTO users(username, password) VALUES ($1, $2)",
        [username, password]
      );
    } else {
      const hashed = await argon2.hash(password);
      await pool.query(
        "INSERT INTO users(username, password) VALUES ($1, $2)",
        [username, hashed]
      );
    }

    const { rows } = await pool.query(
      "SELECT id, username, password FROM users ORDER BY id DESC"
    );

    const newUser = rows[0];

    newUser.passwordDisplay = newUser.password.startsWith("$argon2")
      ? newUser.password.split("$").at(-1)
      : newUser.password;

    res.json({ ok: true, user: newUser, insecureMode });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
