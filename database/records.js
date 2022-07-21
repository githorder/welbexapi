const { selectData, selectDataWhere } = require('./queries/select');
const { insertData } = require('./queries/insert');
const { updateTo } = require('./queries/update');
const { deleteData } = require('./queries/delete');
const { uploadFile, deleteFile } = require('../s3');

const getAllRecords = async (postgres) => {
  try {
    return await selectData(postgres, 'records', [
      'author',
      'published',
      'message',
      'id',
    ]);
  } catch (err) {
    throw err;
  }
};

const getUserRecords = async (postgres, { userId }) => {
  try {
    const [user] = await selectDataWhere(postgres, 'users', ['email'], {
      id: userId,
    });
    return await selectDataWhere(
      postgres,
      'records',
      ['author', 'message', 'published', 'id'],
      { email: user.email }
    );
  } catch (err) {
    throw err;
  }
};

const createUserRecord = async (postgres, { message, userId, files }) => {
  try {
    const [user] = await selectDataWhere(postgres, 'users', ['name', 'email'], {
      id: userId,
    });
    const records = await insertData(
      postgres,
      'records',
      {
        email: user.email,
        author: user.name,
        message,
        published: new Date(),
      },
      ['author', 'message', 'published', 'id']
    );

    if (files?.image) {
      const uploadedFile = await uploadFile(files.image[0]);
      await insertData(
        postgres,
        'images',
        {
          key: uploadedFile.key,
          recordid: records[0].id,
          email: user.email,
        },
        ['key']
      );
    }

    if (files?.video) {
      const uploadedFile = await uploadFile(files.video[0]);
      await insertData(
        postgres,
        'videos',
        {
          key: uploadedFile.key,
          recordid: records[0].id,
          email: user.email,
        },
        ['key']
      );
    }

    return records;
  } catch (err) {
    throw err;
  }
};

const updateUserRecord = async (postgres, { message, recordId, files }) => {
  try {
    let updatedUserRecords = ['message has not been updated'];
    if (message) {
      updatedUserRecords = await updateTo(
        postgres,
        'records',
        ['author', 'message', 'published', 'id'],
        { message, published: new Date() },
        { id: recordId }
      );
    }

    if (files?.image) {
      const [oldImage] = await selectDataWhere(postgres, 'images', ['key'], {
        'images.recordid': recordId,
      });

      await deleteFile(oldImage.key);

      const uploadedFile = await uploadFile(files.image[0]);
      await updateTo(
        postgres,
        'images',
        ['key'],
        {
          key: uploadedFile.key,
        },
        { 'images.recordid': recordId }
      );
    }

    if (files?.video) {
      const [oldVideo] = await selectDataWhere(postgres, 'videos', ['key'], {
        'videos.recordid': recordId,
      });

      await deleteFile(oldVideo.key);

      const uploadedFile = await uploadFile(files.video[0]);
      await updateTo(
        postgres,
        'videos',
        ['key'],
        {
          key: uploadedFile.key,
        },
        { 'videos.recordid': recordId }
      );
    }

    return updatedUserRecords;
  } catch (err) {
    throw err;
  }
};

const deleteUserRecord = async (postgres, { recordId, userId }) => {
  try {
    const [oldVideo] = await selectDataWhere(postgres, 'videos', ['key'], {
      recordid: recordId,
    });
    const [oldImage] = await selectDataWhere(postgres, 'images', ['key'], {
      recordid: recordId,
    });

    if (oldImage) {
      deleteFile(oldImage.key);
      await deleteData(postgres, 'images', { recordid: recordId });
    }
    if (oldVideo) {
      deleteFile(oldVideo.key);
      await deleteData(postgres, 'videos', { recordid: recordId });
    }

    await deleteData(postgres, 'records', { id: recordId });

    return await getUserRecords(postgres, { userId });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllRecords,
  getUserRecords,
  createUserRecord,
  updateUserRecord,
  deleteUserRecord,
};
