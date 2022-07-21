const {
  getAllRecords,
  getUserRecords,
  createUserRecord,
  updateUserRecord,
  deleteUserRecord,
} = require('../database/records');
const { checkInputs } = require('../util/inputs');

const recordsAllGetControl = (res) => async (postgres) => {
  try {
    const allRecords = await getAllRecords(postgres);
    res.status(200).json(allRecords);
  } catch (err) {
    res.status(400).json(err);
  }
};

const recordsUserGetControl = (req, res) => async (postgres) => {
  try {
    const { userId } = req.params;
    checkInputs(userId);
    const userRecords = await getUserRecords(postgres, { userId });
    res.status(200).json(userRecords);
  } catch (err) {
    res.status(400).json(err);
  }
};

const recordsUserPostControl = (req, res) => async (postgres) => {
  try {
    const files = req.files;
    const { message } = req.body;
    const { userId } = req.params;
    checkInputs(message, userId);
    const [newUserRecord] = await createUserRecord(postgres, {
      message,
      userId,
      files,
    });
    res.status(200).json(newUserRecord);
  } catch (err) {
    res.status(400).json(err);
  }
};

const recordsUserPutControl = (req, res) => async (postgres) => {
  try {
    const { message } = req.body;
    const { recordId } = req.query;
    const files = req.files;
    checkInputs(recordId);
    const [updatedUserRecord] = await updateUserRecord(postgres, {
      message,
      recordId,
      files,
    });
    res.status(200).json(updatedUserRecord);
  } catch (err) {
    res.status(400).json(err);
  }
};

const recordUserDeleteControl = (req, res) => async (postgres) => {
  try {
    const { recordId } = req.query;
    const { userId } = req.params;
    checkInputs(recordId, userId);
    const newUserRecords = await deleteUserRecord(postgres, {
      recordId,
      userId,
    });
    res.status(200).json(newUserRecords);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  recordsAllGetControl,
  recordsUserGetControl,
  recordsUserPostControl,
  recordsUserPutControl,
  recordUserDeleteControl,
};
