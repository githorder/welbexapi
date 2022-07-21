const fs = require('fs');
const path = require('path');

const { selectDataWhere } = require('./queries/select');
const { getFileStream } = require('../s3');

const getImage = async (postgres, recordId) => {
  try {
    const [image] = await selectDataWhere(postgres, 'images', ['key'], {
      recordid: recordId,
    });

    if (!image) {
      return fs.createReadStream(path.resolve(__dirname, '..', 'noImage.png'));
    }

    return await getFileStream(image.key);
  } catch (err) {
    throw err;
  }
};

module.exports = { getImage };
