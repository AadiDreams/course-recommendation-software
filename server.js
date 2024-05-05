const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

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
pool.query('SELECT * FROM qs', (err, result) => {
    if (err) {
        return console.error('Error executing query', err.stack);
    }
    console.log(result.rows);
    // Process your results here
});


// Serve index.html when the server starts
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});