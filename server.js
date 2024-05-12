const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON bodies
const bodyParser = require('body-parser');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const { Pool } = require('pg');

const pool = new Pool({
    user: 'ccadmin',
    host: 'localhost',
    database: 'careercraft',
    password: 'ccadmin',
    port: 5432,
});

// Example query
pool.query('SELECT count(*) FROM qs', (err, result) => {
    if (err) {
        return console.error('Error executing query', err.stack);
    }
    console.log(result.rows);
    // Process your results here
});


// Serve index.html when the server starts
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
  console.log("index page successful");
});

app.get('/signIn', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
  console.log("signIn page successful");
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, "public/register.html"));
  console.log("register page successful");
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
  console.log("logout successful");
});

app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname, "public/questions.html"));
});

app.get('/userHome', (req, res) => {
  res.sendFile(path.join(__dirname, "public/signed.html"));
});

// // Handle login POST request
// app.post('/login', (req, res) => {
//   // Extract username and password from request body
//   console.log(req.body);
//   const { username, password } = req.body;
//   console.log(res);
//   // Here you can validate the username and password
//   // For now, let's just send a response based on whether they are provided or not
//   if (username && password) {
//       res.status(200).send(`Received username: ${username}, password: ${password}`);
//   } else {
//       console.log(req.body);
//       res.status(400).send(`Username, password not wokring: ${username}, password: ${password}`);

//   }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});