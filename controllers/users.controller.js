const { checkUserExists } = require("../db/seeds/utils");
const {
  fetchUsers,
  fetchUserByUsername,
  addUser,
} = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    return res.status(200).send({ users });
  } catch {
    next(err);
  }
};

exports.postUser = async (req, res, next) => {
  try {
    const data = req.body;
    const user = await addUser(data);
    return res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await fetchUserByUsername(username);
    return res.status(200).send({ user: user });
  } catch (err) {
    next(err);
  }
};
