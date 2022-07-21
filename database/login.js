const { selectDataWhere, joinTables } = require('./queries/select');
const { checkPassword } = require('../util/inputs');

const makeTransaction =
  ({ email, password }) =>
  async (trx) => {
    try {
      const [login] = await selectDataWhere(trx, 'logins', ['password'], {
        email,
      });
      await checkPassword(password, login);
      return await selectDataWhere(trx, 'users', ['name', 'id'], { email });
    } catch (err) {
      throw err;
    }
  };

const loginUser = async (postgres, userData) => {
  return await postgres.transaction(makeTransaction(userData));
};

module.exports = { loginUser };
