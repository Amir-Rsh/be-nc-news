const { fetchEndpoints } = require("../models/api.model");

exports.getEndpoints = async (req, res, next) => {
  try {
    const endpoints = await fetchEndpoints();
    return res.status(200).send({ endpoints });
  } catch (err) {
    next(err);
  }
};
