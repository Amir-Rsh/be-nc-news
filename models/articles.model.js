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

exports.fetchArticles = async (article_id) => {
  const articles = await db.query(
    `
 SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles 
 ORDER BY created_at DESC
 `
  );

  const comments = await db.query(
    `
 SELECT article_id FROM comments 
 `
  );

  if (articles.rows.length === 0) {
    return Promise.reject({ msg: "Not Found" });
  }
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
