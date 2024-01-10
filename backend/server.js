const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUE (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    console.log(req.body);
    db.query(sql, [req.body.email,req.body.password], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            return res.json({ status: "Success", id: data[0].id })
        }
        else {
            return res.json("Fail")
        }
    })
})

// server.js
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const port = 8081 || process.env.PORT;

app.use(bodyParser.json());

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
  const fileName = `flashcard_${req.params.id}.json`;
  await deleteFlashcard(fileName);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
