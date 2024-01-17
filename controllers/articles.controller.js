const { checkArticleExists } = require("../db/seeds/utils");
const {
  fetchArticleById,
  fetchArticles,
  articlePatcher,
} = require("../models/articles.model");

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await fetchArticleById(article_id);
    return res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await fetchArticles();
    return res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.patchArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const checkArticle = await checkArticleExists(article_id);
    const article = await articlePatcher(article_id, inc_votes);

    return res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
