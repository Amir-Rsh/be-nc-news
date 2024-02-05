const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleExists = async (article_id) => {
  const result = await db.query(
    `
  SELECT * FROM articles WHERE article_id = $1
  `,
    [article_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }
};

exports.checkUserExists = async (username) => {
  const result = await db.query(
    `
    SELECT * FROM users WHERE username = $1
    `,
    [username]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "username does not exist" });
  }
};

exports.checkCommentExists = async (comment_id) => {
  const result = await db.query(
    `
  SELECT * FROM comments WHERE comment_id = $1
  `,
    [comment_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "comment does not exist" });
  }
};

exports.checkTopicExists = async (topic) => {
  const result = await db.query(
    `
  SELECT * FROM topics WHERE slug = $1
  `,
    [topic]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "topic does not exist" });
  }
};
