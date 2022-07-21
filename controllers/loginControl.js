const { loginUser } = require('../database/login');
const { checkInputs } = require('../util/inputs');

const loginControl = (req, res) => async (postgres) => {
  try {
    const { email, password } = req.body;
    checkInputs(email, password);
    const [user] = await loginUser(postgres, { email, password });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = { loginControl };
