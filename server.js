const express = require('express');
const cors = require('cors');
const knex = require('knex');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { registerControl } = require('./controllers/registerControl');
const { loginControl } = require('./controllers/loginControl');
const {
  recordsAllGetControl,
  recordsUserGetControl,
  recordsUserPostControl,
  recordsUserPutControl,
  recordUserDeleteControl,
} = require('./controllers/recordsControl');
const { imagesUserGetControl } = require('./controllers/imagesControl');
const { videosUserGetControl } = require('./controllers/videosControl');

const PORT = process.env.PORT || 8000;
const postgres = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'diyorbaynazarov',
    password: 'Universe2000@',
    database: 'welbexDB',
  },
});

const app = express();

app.use(cors());
app.use(express.json());

app.post('/users', (req, res) => registerControl(req, res)(postgres));
app.post('/logins', (req, res) => loginControl(req, res)(postgres));
app.post(
  '/records/:userId',
  upload.fields([{ name: 'image' }, { name: 'video' }]),
  (req, res) => recordsUserPostControl(req, res)(postgres)
);

app.get('/records', (_, res) => recordsAllGetControl(res)(postgres));
app.get('/records/:userId', (req, res) =>
  recordsUserGetControl(req, res)(postgres)
);
app.get('/images/:recordId', (req, res) =>
  imagesUserGetControl(req, res)(postgres)
);
app.get('/videos/:recordId', (req, res) =>
  videosUserGetControl(req, res)(postgres)
);

app.put(
  '/records',
  upload.fields([{ name: 'image' }, { name: 'video' }]),
  (req, res) => recordsUserPutControl(req, res)(postgres)
);

app.delete('/records/:userId', (req, res) =>
  recordUserDeleteControl(req, res)(postgres)
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
