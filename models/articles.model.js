const db = require("../db/connection");
const { checkTopicExists } = require("../db/seeds/utils");

exports.fetchArticleById = async (article_id, queries) => {
  const article = await db.query(
    `
    SELECT articles.*
    FROM articles 
    WHERE articles.article_id = $1
    `,
    [article_id]
  );
  if (queries.hasOwnProperty("comment_count")) {
    const queriedArticle = await db.query(
      `
      SELECT articles.*, COUNT(comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
      `,
      [article_id]
    );
    return queriedArticle.rows[0];
  }

  return article.rows[0];
};

exports.fetchArticles = async (
  topic,
  sort_by = "created_at",
  order = "desc"
) => {
  const validSortQueries = [
    "created_at",
    "author",
    "article_id",
    "topic",
    "title",
    "comment_count",
    "votes",
  ];
  const validOrderQueries = ["asc", "desc"];
  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort_by query" });
  }
  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }
  let queryStr = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  `;
  const queryParameters = [];
  if (topic) {
    const topicChecker = await checkTopicExists(topic);
    queryStr += " WHERE topic = $1";
    queryParameters.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  const articles = await db.query(queryStr, queryParameters);

  return articles.rows;
};

exports.articlePatcher = async (article_id, inc_votes) => {
  const insertVotes = await db.query(
    `
  UPDATE articles SET votes = votes + $1
  WHERE article_id = $2
  `,
    [inc_votes, article_id]
  );
  const result = await db.query(
    `
  SELECT * FROM articles WHERE article_id = $1
  `,
    [article_id]
  );
  return result.rows[0];
};
