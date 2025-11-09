import { Router, text } from "express";
import { pool } from "../src/db/pool.js";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
const window = new JSDOM("").window;
const purify = DOMPurify(window);

const router = Router();

let xssEnabled = true;

const parseDate = (date) => {
  const dateObj = new Date(date);

  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hour = String(dateObj.getHours()).padStart(2, "0");
  const minute = String(dateObj.getMinutes()).padStart(2, "0");
  const second = String(dateObj.getSeconds()).padStart(2, "0");

  return `${month} ${day} ${year} ${hour}:${minute}:${second}`;
};

router.get("/xss", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, message, created_at FROM guestbook ORDER BY created_at DESC"
    );

    const formattedComments = rows.map((c) => ({
      ...c,
      formatted_datetime: parseDate(c.created_at),
      message: xssEnabled ? c.message : purify.sanitize(c.message),
    }));

    res.render("xss", {
      xss: xssEnabled,
      comments: formattedComments,
    });
  } catch (err) {
    console.error("DB error while fetching comments:", err);
    res.status(500).send("Database error while fetching comments");
  }
});

router.post("/xss-toggle", (req, res) => {
  try {
    const { xss } = req.body;
    xssEnabled = !!xss;
    res.json({ xss: xssEnabled });
  } catch (err) {
    console.log("greska", err);
  }
});

router.post("/comment", async (req, res) => {
  try {
    let { comment, xss } = req.body;

    const reqXssEnabled = typeof xss === "boolean" ? xss : xssEnabled;

    if (!reqXssEnabled) {
      comment = purify.sanitize(comment);
    }

    const result = await pool.query(
      "INSERT INTO guestbook (message) VALUES ($1) RETURNING id, message, created_at",
      [comment]
    );

    const newRow = result.rows[0];

    const formatted_datetime = parseDate(newRow.created_at);

    const returnedMessage = reqXssEnabled
      ? newRow.message
      : purify.sanitize(newRow.message);

    const formattedComment = {
      id: newRow.id,
      message: returnedMessage,
      created_at: newRow.created_at,
      formatted_datetime,
    };

    res.status(201).json({
      message: "Komentar uspješno spremljen!",
      newComment: formattedComment,
    });
  } catch (err) {
    console.log("greskaaaaaaaa prilikom spreamnja komentara u bazu", err);
  }
});

export default router;
