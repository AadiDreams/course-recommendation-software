const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'ccadmin',
    password: 'ccadmin',
    database: 'careercraft'
  }
})

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.get('/login.html', (req, res) => {
  res.sentFile(path.join(__dirname),"about.html");
})

app.listen(port, (req, res) => {
  console.log(`Server started on port ${port}`);
})
