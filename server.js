const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pg = require('pg');
const ejs = require('ejs');

const pool = new pg.Pool({
  user: 'ccadmin',
  password: 'ccadmin',
  database: 'careercraft',
  host: 'localhost',
  port: 5432
});


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.get('/qa', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT question FROM qs');
    const questions = result.rows.map(row => row.question);
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    await client.release();
    res.render('qa', { question: randomQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, (req, res) => {
  console.log(`Server started on port ${port}`);
})
