const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const { promisify } = require('util');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON bodies
const bodyParser = require('body-parser');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Routes
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

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

// // Example query
// pool.query('SELECT count(*) FROM qs', (err, result) => {
//     if (err) {
//         return console.error('Error executing query', err.stack);
//     }
//     console.log(result.rows);
//     // Process your results here
// });


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

// Load the machine learning model
let model;
fs.readFile('question_model.pkl', async (err, data) => {
    if (err) throw err;
});

// Prediction endpoint
app.post('/api/predict', (req, res) => {
    const { question_id, response } = req.body;

    if (!model) {
        return res.status(500).json({ error: 'Model not loaded' });
    }

    const prediction = model.predict([[question_id, response]]);
    res.json({ next_question_id: prediction[0] });
});


// Endpoint to get questions
app.get('/api/questions', (req, res) => {
  pool.query('SELECT question_id, question FROM expected', (err, result) => {
      if (err) {
          console.error('Error executing query', err.stack);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(result.rows);
  });
});

// Define a function to insert user input and update other column values
async function insertAndUpdateUserInput(userId, questionId, userInput) {
  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      
      // Insert the user input into the uservalue table
      await client.query('INSERT INTO uservalue (userid, questionid, userinput) VALUES ($1, $2, $3)', [userId, questionId, userInput]);
      
      // Fetch the expected values for the question
      const result = await client.query('SELECT * FROM expected WHERE question_id = $1', [questionId]);
      const expectedValues = result.rows[0];

      // Prepare the SQL for updating other columns
      const updateQueries = [];
      for (const column in expectedValues) {
          if (column !== 'question_id' && column !== 'question') {
              const expectedValue = expectedValues[column];
              const updatedValue = expectedValue * userInput;
              const quotedColumn = `"${column}"`;
              updateQueries.push(client.query(`UPDATE uservalue SET ${quotedColumn} = $1 WHERE userid = $2 AND questionid = $3`, [updatedValue, userId, questionId]));
          }
      }
      
      // Execute all update queries
      await Promise.all(updateQueries);

      await client.query('COMMIT');
  } catch (error) {
      await client.query('ROLLBACK');
      throw error;
  } finally {
      client.release();
  }
}

// Endpoint to handle user input submission
app.post('/api/submit', async (req, res) => {
  const userId = 101; // Hardcoded user_id for now
  const { questionId, value } = req.body;

  try {
      await insertAndUpdateUserInput(userId, questionId, value);
      res.json({ success: true });
  } catch (error) {
      console.error('Error inserting user input:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/bestCourse', async (req, res) => {
  const userId = 101; // Hardcoded user_id for now

  try {
      const client = await pool.connect();

      console.log("Calculating best course for user:", userId); // Debugging log
      // Get the sums of each column for the given user
      const result = await client.query(`
          SELECT 
              SUM("Computer Science Engineering") AS "Computer Science Engineering",
              SUM("Mechanical Engineering") AS "Mechanical Engineering",
              SUM("Electronics and Communication Engineering") AS "Electronics and Communication Engineering",
              SUM("Electrical Engineering") AS "Electrical Engineering",
              SUM("Electrical and Electronics Engineering") AS "Electrical and Electronics Engineering",
              SUM("Civil Engineering") AS "Civil Engineering",
              SUM("Chemical Engineering") AS "Chemical Engineering",
              SUM("Information Technology") AS "Information Technology"
          FROM uservalue
          WHERE userid = $1
      `, [userId]);

      client.release();

      const sums = result.rows[0];
      let bestCourse = null;
      let highestSum = -Infinity;

      // Identify the column with the highest sum
      for (const column in sums) {
          if (sums[column] > highestSum) {
              highestSum = sums[column];
              bestCourse = column;
          }
      }


      console.log("Best course identified:", bestCourse);
      res.json({ bestCourse });
  } catch (error) {
      console.error('Error calculating best course:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
