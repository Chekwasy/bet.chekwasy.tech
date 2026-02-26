import express from "express";

const app = express();

app.use((req, res) => {
  try {
    const { method, path } = req;

    if (method === "GET" && path === "/") {
      return res.send("Hello Express!");
    }

    if (method === "GET" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      return res.json({ id });
    }

    if (
      method === "GET" &&
      path.startsWith("/posts/")
    ) {
      const parts = path.split("/");
      return res.json({
        postId: parts[2],
        commentId: parts[4],
      });
    }

    return res.status(404).json({ error: "Not Found" });

  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
});

export default app;