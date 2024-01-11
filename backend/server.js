const express = require("express");
const { Pool } = require("pg");
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const pool = new Pool({
  host: "dpg-cmftioeg1b2c73cplbtg-a",
  user: "localhost_g5y1_user",
  password: "qWmrRah6C7TxRKvraRV28W0LxnRMDEEE",
  database: "localhost_g5y1",
  port: 5432
});

// Function to create the login table if it doesn't exist
const createLoginTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS login (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      password VARCHAR(255)
    )
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log("Login table created or already exists");
  } catch (error) {
    console.error("Error creating login table:", error);
  }
};

// Create the login table on server startup
createLoginTable();

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const insertQuery = `
    INSERT INTO login (name, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [name, email, password];
  try {
    const client = await pool.connect();
    const result = await client.query(insertQuery, values);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.json("Error");
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const selectQuery = `
    SELECT * FROM login WHERE email = $1 AND password = $2
  `;
  const values = [email, password];
  try {
    const client = await pool.connect();
    const result = await client.query(selectQuery, values);
    client.release();
    if (result.rowCount > 0) {
      return res.json({ status: "Success", id: result.rows[0].id });
    } else {
      return res.json("Fail");
    }
  } catch (error) {
    console.error("Error querying data:", error);
    res.json("Error");
  }
});

const flashcardsFolder = path.join(__dirname, 'flashcards');

const getFlashcards = async () => {
  try {
    const files = await fs.readdir(flashcardsFolder);
    const flashcards = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(flashcardsFolder, file), 'utf-8');
        return JSON.parse(content);
      })
    );
    return flashcards;
  } catch (error) {
    console.error('Error reading flashcards:', error);
    return [];
  }
};

const saveFlashcard = async (flashcard) => {
  try {
    const fileName = `flashcard_${uuidv4()}.json`;
    const filePath = path.join(flashcardsFolder, fileName);
    await fs.writeFile(filePath, JSON.stringify(flashcard, null, 2));
  } catch (error) {
    console.error('Error saving flashcard:', error);
  }
};

const deleteFlashcard = async (fileName) => {
  try {
    const filePath = path.join(flashcardsFolder, fileName);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting flashcard:', error);
  }
};

app.get('/api/flashcards', async (req, res) => {
  const flashcards = await getFlashcards();
  res.json(flashcards);
});

app.post('/api/flashcards', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFlashcard = {
      id: uuidv4(),
      question,
      answer,
    };
    await saveFlashcard(newFlashcard);
    res.json(newFlashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).send('Error creating flashcard');
  }
});

app.delete('/api/flashcards/:id', async (req, res) => {
  const fileName= `flashcard_${req.params.id}.json`;
  await deleteFlashcard(fileName);
  res.json({ success: true });
});

const port = 5432 || process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});