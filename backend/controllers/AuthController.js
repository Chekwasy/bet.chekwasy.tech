import redisClient from "../utils/redis.js";
import { v4 as uuidv4 } from "uuid";
import sha1 from "sha1";
import dbClient from "../utils/db.js";
import { ObjectId } from "mongodb";

class AuthController {
  // LOGIN
  static async getConnect(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const encoded = authHeader.split(" ")[1];
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const [email, rawPassword] = decoded.split(":");
      const password = sha1(rawPassword);

      const db = await dbClient.db();

      const user = await db.collection("users").findOne({
        email,
        password,
      });

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = uuidv4();

      await redisClient.set(
        `checks_auth_${token}`,
        user._id.toString(),
        7 * 24 * 60 * 60
      );

      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ error: "Login failed" });
    }
  }

  // LOGOUT
  static async getDisconnect(req, res) {
    const token = req.headers["x-token"];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = await redisClient.get(`checks_auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await redisClient.del(`checks_auth_${token}`);

    return res.status(204).send();
  }

  // SEND RESET TOKEN
  static async postSend_tok(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({});

      const db = await dbClient.db();

      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "No user found" });
      }

      const token = Math.floor(100000 + Math.random() * 900000);

      await redisClient.set(email, token.toString(), 10 * 60);

      // Call mail function directly here when needed

      return res.json({ status: "ok" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to send token" });
    }
  }

  // VERIFY TOKEN
  static async postChecktoken(req, res) {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: "email or token missing" });
    }

    const storedToken = await redisClient.get(email);

    if (!storedToken) {
      return res.status(400).json({ error: "token not found" });
    }

    if (storedToken !== token.toString()) {
      return res.status(403).json({ error: "wrong token" });
    }

    return res.status(200).json({ status: "ok" });
  }

  // RESET PASSWORD
  static async postPwdreset(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const { token } = req.body;

      if (!authHeader) {
        return res.status(400).json({ error: "Missing authorization" });
      }

      const encoded = authHeader.split(" ")[1];
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const [email, rawPassword] = decoded.split(":");
      const password = sha1(rawPassword);

      if (!email || !password || !token) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const storedToken = await redisClient.get(email);

      if (!storedToken) {
        return res.status(400).json({ error: "token not found" });
      }

      if (storedToken !== token.toString()) {
        return res.status(403).json({ error: "wrong token" });
      }

      const db = await dbClient.db();

      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "No user found" });
      }

      await db.collection("users").updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { password } }
      );

      return res.status(200).json({ status: "ok" });
    } catch (err) {
      return res.status(500).json({ error: "Password reset failed" });
    }
  }
}

export default AuthController;