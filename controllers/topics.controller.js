const { fetchTopics } = require("../models/topics.model");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    return res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};
