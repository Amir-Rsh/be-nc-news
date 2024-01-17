const { fetchUsers } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    return res.status(200).send({ users });
  } catch {
    next(err);
  }
};
