const { fetchUsers } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    return res.status(200).jsonp({ users });
  } catch {
    next(err);
  }
};
