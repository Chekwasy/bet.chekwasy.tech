import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

// Extend globalThis for caching
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "bet_chekwasy";

if (!uri) {
  throw new Error("Please define MONGO_URI in environment variables");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri);

  // Vercel connection pooling optimization
  attachDatabasePool(client);

  globalThis._mongoClientPromise = client.connect();
}

clientPromise = globalThis._mongoClientPromise;

class DBClient {
  async db() {
    const client = await clientPromise;
    return client.db(dbName);
  }

  async isAlive(): Promise<boolean> {
    try {
      const db = await this.db();
      await db.command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }

  async nbUsers(): Promise<number> {
    const db = await this.db();
    return db.collection("users").estimatedDocumentCount();
  }

  async nbFiles(): Promise<number> {
    const db = await this.db();
    return db.collection("files").estimatedDocumentCount();
  }

  async nbGames(): Promise<number> {
    const db = await this.db();
    return db.collection("games").estimatedDocumentCount();
  }
}

const dbClient = new DBClient();
export default dbClient;
