const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchEndpoints = async () => {
  const result = await fs.readFile("./endpoints.json", "utf-8");
  return JSON.parse(result);
};
