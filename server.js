import express from 'express';
import blog from './api/blog.js';
// import authenticate from './api/authenticate.js';
// import verifyAccess from './middlewares/verifyAccess.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

app.use(express.static('public', {
  extensions: ['html', 'htm'],
}));

// post requests require access token
app.post('/api/blog', (req, res) => {
  blog(req, res);
});

// no access token required for get requests
app.get('/api/blog', (req, res) => {
  blog(req, res);
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});


