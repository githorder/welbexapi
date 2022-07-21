const bcrypt = require('bcrypt');

const checkInputs = (...inputs) => {
  const isEmpty = inputs.some((input) => !input || input?.length === 0);
  if (isEmpty) throw new Error('not enough data provided');
};

const capitilizeInput = (input) => {
  return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
};

const saltRounds = 10;

const createHash = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw err;
  }
};

const compareHash = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    throw err;
  }
};

const checkPassword = async (password, login) => {
  try {
    const isEqual = await compareHash(password, login?.password);
    if (!isEqual) throw new Error('user does not exist');
  } catch (err) {
    throw err;
  }
};

module.exports = { checkInputs, capitilizeInput, createHash, checkPassword };
