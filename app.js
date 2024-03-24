const express = require("express");
const cors = require("cors");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
  patchArticlesById,
} = require("./controllers/articles.controller");
const {
  getCommentsById,
  postComments,
  removeCommentById,
} = require("./controllers/comments.controller");
const {
  getUsers,
  getUserByUsername,
  postUser,
} = require("./controllers/users.controller");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticlesById);

app.delete("/api/comments/:comment_id", removeCommentById);

app.get("/api/users", getUsers);

app.post("/api/users", postUser);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request. Missing properties." });
  }
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  console.log(err);
});

module.exports = app;
