const { insertData } = require('./queries/insert');
const { createHash } = require('../util/inputs');

const makeUserTransaction =
  ({ name, email, password }) =>
  async (trx) => {
    try {
      const newUser = await insertData(trx, 'users', { name, email }, [
        'name',
        'id',
      ]);
      await insertData(trx, 'logins', {
        email,
        password: await createHash(password),
      });
      return newUser;
    } catch (err) {
      throw err;
    }
  };

const createUser = (postgres, userData) => {
  return postgres.transaction(makeUserTransaction(userData));
};

module.exports = { createUser };
