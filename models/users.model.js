const db = require("../db/connection");
const {
  checkUserNotExists,
  checkUserExists,
  checkUserIdExists,
} = require("../db/seeds/utils");

exports.fetchUsers = async () => {
  const result = await db.query(`
    SELECT * FROM users
    `);
  return result.rows;
};

exports.addUser = async (data) => {
  if (
    typeof data.username !== "string" ||
    typeof data.name !== "string" ||
    typeof data.avatar_url !== "string" ||
    typeof data.user_id !== "string"
  ) {
    return Promise.reject({
      status: 400,
      msg: "details have not been provided",
    });
  }
  const checkUser = await checkUserNotExists(data.username);
  const result = await db.query(
    `
  INSERT INTO users
  (user_id, username, name, avatar_url)
  VALUES
  ($1, $2, $3, $4)
  RETURNING *
  `,
    [data.user_id, data.username, data.name, data.avatar_url]
  );
  return result.rows[0];
};

exports.fetchUserByUsername = async (user_id) => {
  const checkUser = await checkUserIdExists(user_id);

  const result = await db.query(
    `
    SELECT users.*
    FROM users
    WHERE users.user_id = $1
  `,
    [user_id]
  );
  return result.rows[0];
};
