const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
const { getArticleById } = require("./controllers/articles.controller");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = app;
