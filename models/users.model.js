const db = require("../db/connection");
const { checkUserNotExists, checkUserExists } = require("../db/seeds/utils");

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
    typeof data.avatar_url !== "string"
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
  (username, name, avatar_url)
  VALUES
  ($1, $2, $3)
  RETURNING *
  `,
    [data.username, data.name, data.avatar_url]
  );
  return result.rows[0];
};

exports.fetchUserByUsername = async (username) => {
  const checkUser = await checkUserExists(username);

  const result = await db.query(
    `
    SELECT users.*
    FROM users
    WHERE users.username = $1
  `,
    [username]
  );
  return result.rows[0];
};
