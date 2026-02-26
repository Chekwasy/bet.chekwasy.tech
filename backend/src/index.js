import express from "express";
import mapRoute from "../routes/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register your existing routes
//mapRoute(app);

// Optional test route
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

export default app;