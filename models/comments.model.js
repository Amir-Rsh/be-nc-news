const db = require("../db/connection");
const { checkUserExists } = require("../db/seeds/utils");

exports.fetchCommentsById = async (article_id) => {
  const comments = await db.query(
    `
  SELECT * FROM comments WHERE article_id = $1
  ORDER BY created_at
  `,
    [article_id]
  );

  return comments.rows;
};

exports.postCommentsById = async (article_id, postedComment) => {
  if (
    postedComment.hasOwnProperty("username") &&
    typeof postedComment.username === "string"
  ) {
    const checkUser = await checkUserExists(postedComment.username);
  }
  const newComment = await db.query(
    `
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `,
    [article_id, postedComment.username, postedComment.body]
  );

  return newComment.rows[0];
};

exports.deleteCommentById = async (comment_id) => {
  const removedComment = await db.query(
    `
  DELETE FROM comments WHERE comment_id = $1
  `,
    [comment_id]
  );
};
