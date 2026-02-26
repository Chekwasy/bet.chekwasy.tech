import AppController from "../controllers/AppController.js";
import UsersController from "../controllers/UsersController.js";
import AuthController from "../controllers/AuthController.js";
import FilesController from "../controllers/FilesController.js";
import GamesController from "../controllers/GamesController.js";

export default async function handler(req, res) {
  // Enable CORS manually
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-token, authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;
  const url = req.url.split("?")[0]; // remove query string
  const segments = url.split("/").filter(Boolean);

  // Expecting /api/v1/...
  if (segments[0] !== "v1") {
    return res.status(404).json({ error: "Route not found" });
  }

  try {
    // -------- STATUS --------
    if (method === "GET" && segments[1] === "status") {
      return AppController.getStatus(req, res);
    }

    if (method === "GET" && segments[1] === "stats") {
      return AppController.getStats(req, res);
    }

    // -------- USERS --------
    if (method === "POST" && segments[1] === "users") {
      return UsersController.postNew(req, res);
    }

    if (method === "GET" && segments[1] === "users" && segments[2] === "me") {
      return UsersController.getMe(req, res);
    }

    if (method === "PUT" && segments[1] === "update") {
      return UsersController.putUpdate(req, res);
    }

    if (method === "PUT" && segments[1] === "bal_res") {
      return UsersController.putBalance(req, res);
    }

    // -------- AUTH --------
    if (method === "GET" && segments[1] === "connect") {
      return AuthController.getConnect(req, res);
    }

    if (method === "GET" && segments[1] === "disconnect") {
      return AuthController.getDisconnect(req, res);
    }

    if (method === "POST" && segments[1] === "send_tok") {
      return AuthController.postSend_tok(req, res);
    }

    if (method === "POST" && segments[1] === "pwdreset") {
      return AuthController.postPwdreset(req, res);
    }

    if (method === "POST" && segments[1] === "checktoken") {
      return AuthController.postChecktoken(req, res);
    }

    // -------- FILES --------
    if (method === "POST" && segments[1] === "files") {
      return FilesController.postUpload(req, res);
    }

    if (method === "GET" && segments[1] === "files" && segments.length === 2) {
      return FilesController.getIndex(req, res);
    }

    if (method === "GET" && segments[1] === "files" && segments.length === 3) {
      req.params = { id: segments[2] };
      return FilesController.getShow(req, res);
    }

    if (method === "PUT" && segments[1] === "files" && segments[3] === "publish") {
      req.params = { id: segments[2] };
      return FilesController.putPublish(req, res);
    }

    if (method === "PUT" && segments[1] === "files" && segments[3] === "unpublish") {
      req.params = { id: segments[2] };
      return FilesController.putUnpublish(req, res);
    }

    if (method === "GET" && segments[1] === "files" && segments[3] === "data") {
      req.params = { id: segments[2] };
      return FilesController.getFile(req, res);
    }

    // -------- GAMES --------
    if (method === "GET" && segments[1] === "games") {
      req.params = { date: segments[2] };
      return GamesController.getGames(req, res);
    }

    if (method === "GET" && segments[1] === "odds") {
      req.params = { date: segments[2] };
      return GamesController.getOdds(req, res);
    }

    if (method === "POST" && segments[1] === "bet") {
      return GamesController.postBet(req, res);
    }

    if (method === "GET" && segments[1] === "openbet") {
      req.params = { pg: segments[2] };
      return GamesController.getOpenbet(req, res);
    }

    if (method === "GET" && segments[1] === "closebet") {
      req.params = { pg: segments[2] };
      return GamesController.getClosebet(req, res);
    }

    if (method === "POST" && segments[1] === "postodds") {
      req.params = { date: segments[2] };
      return GamesController.postOdds(req, res);
    }

    if (method === "GET" && segments[1] === "savedgames") {
      req.params = { id: segments[2] };
      return GamesController.getSavedgames(req, res);
    }

    if (method === "POST" && segments[1] === "savedgames") {
      return GamesController.postSavedgames(req, res);
    }

    return res.status(404).json({ error: "Route not found" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}