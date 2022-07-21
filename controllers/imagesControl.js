const { checkInputs } = require('../util/inputs');
const { getImage } = require('../database/images');

const imagesUserGetControl = (req, res) => async (postgres) => {
  try {
    const { recordId } = req.params;
    checkInputs(recordId);
    const readableStream = await getImage(postgres, recordId);

    readableStream.pipe(res);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = { imagesUserGetControl };
