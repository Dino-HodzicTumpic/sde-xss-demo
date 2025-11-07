import express, { urlencoded, json } from "express";
import { join } from "path";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Middleware
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.static("public"));

app.use(
  session({
    secret: "security-demo-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Pokretanje servera
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
