const express = require("express");
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
} = require("./controllers/comments.controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticlesById);

app.use((err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
  if (err.msg === "article not found") {
    res.status(404).send({ msg: err.msg });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request. Missing properties." });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Bad Request" });
  }
  if (err.msg === "username does not exist") {
    res.status(404).send({ msg: err.msg });
  }
  // console.log(err);
});

module.exports = app;
