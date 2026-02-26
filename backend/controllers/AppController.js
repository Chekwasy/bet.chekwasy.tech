import redisClient from "../utils/redis.js";
import dbClient from "../utils/db.ts";

/**
 * Contains miscellaneous handlers for site stability
 */
class AppController {
  static async getStatus(req, res) {
    try {
      const redisAlive = await redisClient.isAlive();
      const dbAlive = await dbClient.isAlive();

      return res.status(200).json({
        redis: redisAlive,
        db: dbAlive,
      });
    } catch (err) {
      return res.status(500).json({
        redis: false,
        db: false,
        error: "Service unavailable",
      });
    }
  }

  static async getStats(req, res) {
    try {
      const dbAlive = await dbClient.isAlive();

      if (!dbAlive) {
        return res.status(500).json({
          error: "Database not connected",
        });
      }

      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();
      const games = await dbClient.nbGames();

      return res.status(200).json({
        users,
        files,
        games,
      });
    } catch (err) {
      return res.status(500).json({
        error: "Failed to fetch stats",
      });
    }
  }
}

export default AppController;
//module.exports = AppController;