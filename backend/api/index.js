import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello Express!");
});

app.get("/second", (_req, res) => {
  res.send("jjklk");
});

app.get("/posts/:postId/comments/:commentId", (req, res) => {
  res.json({
    postId: req.params.postId,
    commentId: req.params.commentId,
  });
});

export default serverless(app);