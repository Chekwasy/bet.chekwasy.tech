import redisClient from "../utils/redis.js";
import { ObjectId } from "mongodb";
import scrap from "../scrap.js";
import resultJob from "../result.js";
import dbClient from "../utils/db.js";

class GamesController {
  // GET GAMES BY DATE
  static async getGames(req, res) {
    const { date } = req.params;
    if (!date || date.length !== 8)
      return res.status(400).json({});

    const db = await dbClient.db();
    const today = new Date();

    for (let i = 0; i < 8; i++) {
      const nex = new Date(today.getTime() + i * 86400000);
      const d = nex.toISOString().slice(0, 10).replaceAll("-", "");

      if (date === d) {
        await scrap();

        const doc = await db.collection("dates").findOne({ date: d });

        if (doc)
          return res.status(200).json({ games: doc.games });
      }
    }

    return res.status(400).json({ error: "Date not in range" });
  }

  // PLACE BET
  static async postBet(req, res) {
    const token = req.headers["x-token"];
    if (!token)
      return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId)
      return res.status(401).json({ error: "Unauthorized" });

    const db = await dbClient.db();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user)
      return res.status(401).json({ error: "Unauthorized" });

    const {
      stakeAmt,
      betTime,
      gameStatus,
      outcome,
      totalOdd,
      expReturns,
      games,
    } = req.body;

    if (!stakeAmt || !games)
      return res.status(400).json({});

    if (parseFloat(stakeAmt) >
        parseFloat(user.account_balance))
      return res
        .status(400)
        .json({ error: "balance insufficient" });

    const result = await db.collection("games").insertOne({
      userId: new ObjectId(userId),
      stakeAmt,
      betTime,
      gameStatus,
      outcome,
      totalOdd,
      expReturns,
      games,
    });

    return res.status(200).json({
      gameId: result.insertedId.toString(),
      userId,
    });
  }

  // OPEN BETS
  static async getOpenbet(req, res) {
    const token = req.headers["x-token"];
    if (!token)
      return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId)
      return res.status(401).json({ error: "Unauthorized" });

    const db = await dbClient.db();

    await resultJob(); // renamed from res()

    const page = parseInt(req.params.pg || 1);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const count = await db.collection("games")
      .countDocuments({
        userId: new ObjectId(userId),
        gameStatus: "open",
      });

    const games = await db.collection("games")
      .find({
        userId: new ObjectId(userId),
        gameStatus: "open",
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    return res.status(200).json({
      count,
      opengames: games,
    });
  }

  // CLOSED BETS
  static async getClosebet(req, res) {
    const token = req.headers["x-token"];
    if (!token)
      return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId)
      return res.status(401).json({ error: "Unauthorized" });

    const db = await dbClient.db();

    await resultJob();

    const page = parseInt(req.params.pg || 1);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const count = await db.collection("games")
      .countDocuments({
        userId: new ObjectId(userId),
        gameStatus: "close",
      });

    const games = await db.collection("games")
      .find({
        userId: new ObjectId(userId),
        gameStatus: "close",
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    return res.status(200).json({
      count,
      closegames: games,
    });
  }

  // GET ODDS
  static async getOdds(req, res) {
    const { date } = req.params;
    if (!date || date.length !== 8)
      return res.status(400).json({});

    const db = await dbClient.db();

    const odds = await db.collection("odds")
      .findOne({ date });

    if (!odds)
      return res.status(400)
        .json({ error: "Date not in range" });

    return res.status(200).json({
      odds: odds.odds,
    });
  }

  // SAVED GAMES (REDIS)
  static async getSavedgames(req, res) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({});

    const saved = await redisClient.get(id);

    return res.status(200).json({
      savedgames: saved ? JSON.parse(saved) : {},
    });
  }

  static async postSavedgames(req, res) {
    const { id_, savedgames } = req.body;
    if (!id_ || !savedgames)
      return res.status(400).json({});

    await redisClient.set(
      id_,
      JSON.stringify(savedgames),
      24 * 60 * 60
    );

    return res.status(200).json({ status: "ok" });
  }
}

export default GamesController;