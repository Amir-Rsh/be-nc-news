const { fetchCommentsById } = require("../models/comments.model");

exports.getCommentsById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await fetchCommentsById(article_id);
    return res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
