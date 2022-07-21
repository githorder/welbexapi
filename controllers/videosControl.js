const { checkInputs } = require('../util/inputs');
const { getVideo } = require('../database/videos');

const videosUserGetControl = (req, res) => async (postgres) => {
  try {
    const { recordId } = req.params;
    checkInputs(recordId);
    const readableStream = await getVideo(postgres, recordId);

    readableStream.pipe(res);
  } catch (err) {
    throw err;
  }
};

module.exports = { videosUserGetControl };
