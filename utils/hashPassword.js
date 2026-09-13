const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const encryptPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

module.exports = encryptPassword;
