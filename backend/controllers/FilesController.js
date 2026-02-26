import dbClient from "../utils/db.js";
import redisClient from "../utils/redis.js";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import FS from "fs";
import mime from "mime-types";

const path = process.env.FOLDER_PATH || "/tmp/bet_chekwasy";

class FilesController {
  // 🔹 UPLOAD
  static async postUpload(req, res) {
    const token = req.headers["x-token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const db = await dbClient.db();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { name, type, parentId = "0", isPublic = false, data } = req.body;

    if (!name) return res.status(400).json({ error: "Missing name" });
    if (!type) return res.status(400).json({ error: "Missing type" });

    if ((type === "file" || type === "image") && !data) {
      return res.status(400).json({ error: "Missing data" });
    }

    if (type === "folder") {
      const result = await db.collection("files").insertOne({
        userId: new ObjectId(userId),
        name,
        type,
        parentId,
        isPublic,
      });

      return res.status(201).json({
        id: result.insertedId.toString(),
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    }

    // 🔹 FILE / IMAGE
    const newFileName = uuidv4();

    await fs.mkdir(path, { recursive: true });
    await fs.writeFile(
      `${path}/${newFileName}`,
      Buffer.from(data, "base64")
    );

    const result = await db.collection("files").insertOne({
      userId: new ObjectId(userId),
      name,
      type,
      parentId,
      isPublic,
      localPath: `${path}/${newFileName}`,
    });

    return res.status(201).json({
      id: result.insertedId.toString(),
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }

  // 🔹 GET FILE META
  static async getShow(req, res) {
    const token = req.headers["x-token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const db = await dbClient.db();

    const file = await db.collection("files").findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(userId),
    });

    if (!file) return res.status(404).json({ error: "Not found" });

    return res.json({
      id: file._id.toString(),
      userId: file.userId.toString(),
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  // 🔹 LIST FILES
  static async getIndex(req, res) {
    const token = req.headers["x-token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const db = await dbClient.db();

    const parentId = req.query.parentId || "0";
    const page = parseInt(req.query.page || 0);
    const limit = 20;

    const files = await db
      .collection("files")
      .find({
        userId: new ObjectId(userId),
        parentId,
      })
      .skip(page * limit)
      .limit(limit)
      .toArray();

    return res.json(files);
  }

  // 🔹 PUBLISH / UNPUBLISH
  static async putPublish(req, res, isPublic = true) {
    const token = req.headers["x-token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const db = await dbClient.db();

    const file = await db.collection("files").findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(userId),
    });

    if (!file) return res.status(404).json({ error: "Not found" });

    await db.collection("files").updateOne(
      { _id: file._id },
      { $set: { isPublic } }
    );

    return res.json({ ...file, isPublic });
  }

  static async putUnpublish(req, res) {
    return FilesController.putPublish(req, res, false);
  }

  // 🔹 GET FILE CONTENT
  static async getFile(req, res) {
    const db = await dbClient.db();

    const file = await db.collection("files").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!file) return res.status(404).json({ error: "Not found" });

    if (!file.isPublic) {
      const token = req.headers["x-token"];
      if (!token) return res.status(404).json({ error: "Not found" });

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId || userId !== file.userId.toString()) {
        return res.status(404).json({ error: "Not found" });
      }
    }

    if (file.type === "folder") {
      return res.status(400).json({
        error: "A folder doesn't have content",
      });
    }

    const filePath = file.localPath;

    try {
      await fs.access(filePath);

      const mimeType = mime.lookup(file.name);
      res.setHeader(
        "Content-Type",
        mimeType || "application/octet-stream"
      );

      return res.sendFile(filePath);
    } catch {
      return res.status(404).json({ error: "Not found" });
    }
  }
}

export default FilesController;