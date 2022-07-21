const fs = require('fs');
const path = require('path');

const { selectDataWhere } = require('./queries/select');
const { getFileStream } = require('../s3');

const getVideo = async (postgres, recordId) => {
  try {
    const [video] = await selectDataWhere(postgres, 'videos', ['key'], {
      recordid: recordId,
    });

    if (!video) {
      return fs.createReadStream(path.resolve(__dirname, '..', 'noVideo.png'));
    }

    return await getFileStream(video.key);
  } catch (err) {
    throw err;
  }
};

module.exports = { getVideo };
