const db = require("../db/connection");

exports.fetchArticleById = async (article_id) => {
  const article = await db.query(
    `
 SELECT * FROM articles 
 WHERE article_id = $1
 `,
    [article_id]
  );
  if (article.rows.length === 0) {
    return Promise.reject({ msg: "Not Found" });
  }
  return { article: article.rows[0] };
};
