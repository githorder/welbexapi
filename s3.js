require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const { readFile } = require('node:fs/promises');

const Bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({ region, accessKeyId, secretAccessKey });

// upload a file to s3 bucket
const uploadFile = async (file) => {
  try {
    const Body = await readFile(file.path);
    const uploadParams = { Body, Bucket, Key: file.filename };
    return s3.upload(uploadParams).promise();
  } catch (err) {
    throw err;
  }
};

// get a file from s3 bucket to server to client
const getFileStream = async (Key) => {
  try {
    const downloadParams = { Key, Bucket };
    return s3.getObject(downloadParams).createReadStream();
  } catch (err) {
    throw err;
  }
};

const deleteFile = async (Key) => {
  try {
    const deleteParams = { Key, Bucket };
    s3.deleteObject(deleteParams, function (err, _) {
      if (err) console.log(err, err.stack);
      else console.log();
    });
  } catch (err) {
    throw err;
  }
};

module.exports = { uploadFile, getFileStream, deleteFile };
