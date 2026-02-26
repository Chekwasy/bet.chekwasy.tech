import express from "express";
import scrap from "../scrap.js";
import dbClient from "../utils/db.js";

const app = express();

app.get("/api/:date", async (req, res) => {
  const { date } = req.params;

  if (!date || date.length !== 8) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    const db = await dbClient.db();
    const today = new Date();

    for (let i = 0; i < 8; i++) {
      const nex = new Date(today.getTime() + i * 86400000);
      const d = nex.toISOString().slice(0, 10).replaceAll("-", "");

      if (date === d) {
        await scrap();

        const doc = await db.collection("dates").findOne({ date: d });

        if (doc) {
          return res.status(200).json({ games: doc.games });
        }
      }
    }

    return res.status(400).json({ error: "Date not in range" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default app;