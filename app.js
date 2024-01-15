const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "endpoint not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
