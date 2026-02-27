import dbClient from "../utils/db.ts";
import sha1 from "sha1";
import redisClient from "../utils/redis.js";
import { ObjectId } from "mongodb";

class UsersController {
  // SIGN UP
  static async postNew(req, res) {
    try {
      const usrDet = req.body.emailpwd;
      if (!usrDet)
        return res.status(400).json({});

      const encoded = usrDet.split(" ")[1];
      const decoded = Buffer.from(encoded, "base64")
        .toString("utf-8");

      const [email, rawPassword] = decoded.split(":");

      if (!email)
        return res.status(400)
          .json({ error: "Missing email" });

      if (!rawPassword)
        return res.status(400)
          .json({ error: "Missing password" });

      const db = await dbClient.db();

      const existing = await db
        .collection("users")
        .findOne({ email });

      if (existing)
        return res.status(409)
          .json({ error: "Already exist" });

      await db.collection("users").insertOne({
        email,
        password: sha1(rawPassword),
        account_balance: "100000",
        first_name: "",
        last_name: "",
        phone: "",
      });

      return res.status(201).json({ email });
    } catch (err) {
      return res.status(500)
        .json({ error: "Signup failed" });
    }
  }

  // GET LOGGED-IN USER
  static async getMe(req, res) {
    const token = req.headers["x-token"];
    if (!token)
      return res.status(401).json({});

    const userId = await redisClient.get(
      `checks_auth_${token}`
    );

    if (!userId)
      return res.status(401).json({});

    const db = await dbClient.db();

    const user = await db
      .collection("users")
      .findOne({
        _id: new ObjectId(userId),
      });

    if (!user)
      return res.status(401).json({});

    return res.json({
      email: user.email,
      account_balance: user.account_balance,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    });
  }

  // UPDATE BALANCE
  static async putBalance(req, res) {
    const token = req.headers["x-token"];
    if (!token)
      return res.status(401)
        .json({ error: "Unauthorized" });

    const userId = await redisClient.get(
      `checks_auth_${token}`
    );

    if (!userId)
      return res.status(401)
        .json({ error: "Unauthorized" });

    const db = await dbClient.db();

    const user = await db
      .collection("users")
      .findOne({
        _id: new ObjectId(userId),
      });

    if (!user)
      return res.status(401)
        .json({ error: "Unauthorized" });

    const { newbal } = req.body;
    if (!newbal)
      return res.status(400).json({});

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          account_balance: newbal.toString(),
        },
      }
    );

    return res.json({
      id: userId,
      email: user.email,
      status: "done",
    });
  }

  // UPDATE PROFILE
  static async putUpdate(req, res) {
    const token = req.headers["x-token"];
    if (!token)
      return res.status(401)
        .json({ error: "Unauthorized" });

    const userId = await redisClient.get(
      `checks_auth_${token}`
    );

    if (!userId)
      return res.status(401)
        .json({ error: "Unauthorized" });

    const db = await dbClient.db();

    const { first_name, last_name, phone } = req.body;

    if (!first_name || !last_name || !phone)
      return res.status(400)
        .json({ error: "missing data" });

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: { first_name, last_name, phone },
      }
    );

    return res.status(200).json({
      status: "ok",
    });
  }
}

export default UsersController;
//module.exports = UsersController;