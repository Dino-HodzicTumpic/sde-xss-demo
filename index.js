import express, { urlencoded, json } from "express";
import path, { join } from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import { initDb } from "./src/db/initDb.js";
import xssRouter from "./routes/xss.js";
import sensitiveDataRouter from "./routes/sensitiveData.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Middleware
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.cookie("demo_cookie", "this_is_a_demo_value", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60,
  });
  next();
});

// inicijalizacija baze podataka
/*(async () => {
  await initDb();
})();*/

app.use("/", xssRouter);
app.use("/", sensitiveDataRouter);

//rute
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/xss", (req, res) => {
  res.render("xss", {});
});

// Pokretanje servera
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
