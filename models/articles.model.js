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

exports.fetchArticles = async (topic) => {
  let queryStr = `
  SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles
  `;
  const queryParameters = [];
  if (topic) {
    const topicChecker = await checkTopicExists(topic);
    queryStr += " WHERE topic = $1";
    queryParameters.push(topic);
  }
  queryStr += ` ORDER BY created_at DESC;`;
  const articles = await db.query(queryStr, queryParameters);

  const comments = await db.query(
    `
 SELECT article_id FROM comments 
 `
  );

  const addCommentCount = articles.rows.map((article) => {
    let commentCount = 0;
    comments.rows.map((comment) => {
      if (comment.article_id === article.article_id) {
        commentCount += 1;
      }
    });
    article.comment_count = commentCount;
  });
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
