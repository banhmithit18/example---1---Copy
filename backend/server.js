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

const loginFilePath = path.join(__dirname, 'login.txt');

const saveLoginData = async (data) => {
  try {
    await fs.writeFile(loginFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving login data:', error);
  }
};

const getLoginData = async () => {
  try {
    const content = await fs.readFile(loginFilePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading login data:', error);
    return [];
  }
};

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const loginData = await getLoginData();
  const newUserData = { id: loginData.length + 1, name, email, password };
  loginData.push(newUserData);
  await saveLoginData(loginData);
  res.json(newUserData);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const loginData = await getLoginData();
  const user = loginData.find((userData) => userData.email === email && userData.password === password);
  if (user) {
    res.json({ status: "Success", id: user.id });
  } else {
    res.json("Fail");
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