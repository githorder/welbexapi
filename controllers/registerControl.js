const { createUser } = require('../database/register');
const { checkInputs, capitilizeInput } = require('../util/inputs');

const registerControl = (req, res) => async (postgres) => {
  try {
    const { name, email, password } = req.body;
    checkInputs(name, email, password);
    const [newUser] = await createUser(postgres, {
      name: capitilizeInput(name),
      email,
      password,
    });
    return res.json(newUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = { registerControl };
