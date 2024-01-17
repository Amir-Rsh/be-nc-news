const {
  checkArticleExists,
  checkUserExists,
  checkCommentExists,
} = require("../db/seeds/utils");
const {
  fetchCommentsById,
  postCommentsById,
  deleteCommentById,
} = require("../models/comments.model");

exports.getCommentsById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const checkArticle = await checkArticleExists(article_id);
    const comments = await fetchCommentsById(article_id);
    return res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postComments = async (req, res, next) => {
  try {
    const newComment = req.body;
    const { article_id } = req.params;
    const checkArticle = await checkArticleExists(article_id);

    const comment = await postCommentsById(article_id, newComment);
    return res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.removeCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const checkComment = await checkCommentExists(comment_id);

    const commentRemover = await deleteCommentById(comment_id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
