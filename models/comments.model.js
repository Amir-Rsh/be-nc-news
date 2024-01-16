const db = require("../db/connection");

exports.fetchCommentsById = async (article_id) => {
  const comments = await db.query(
    `
  SELECT * FROM comments WHERE article_id = $1
  ORDER BY created_at
  `,
    [article_id]
  );
  if (comments.rows.length === 0) {
    return Promise.reject({ msg: "Not Found" });
  }
  return comments.rows;
};
