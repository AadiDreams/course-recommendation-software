const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'postgres',
    database: 'CareerCraft'
  }
})

const app = express();

// No need for a separate staticPath variable as we're serving from the current directory
app.use(bodyParser.json());
app.use(express.static(__dirname));  // Serves static files from current directory

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.listen(3000, (req, res) => {
  console.log('listening on port 3000......')
})
