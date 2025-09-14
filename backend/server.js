import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const FLASHCARDS_FILE = path.join(DATA_DIR, 'flashcards.json');
const SUBJECTS_FILE = path.join(DATA_DIR, 'subjects.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

// Helper functions
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

const writeJSONFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Flashcards endpoints
app.get('/api/flashcards', async (req, res) => {
  const flashcards = await readJSONFile(FLASHCARDS_FILE);
  if (flashcards === null) {
    return res.status(500).json({ error: 'Failed to read flashcards' });
  }
  res.json(flashcards);
});

app.post('/api/flashcards', async (req, res) => {
  const { question, answer, subject, difficulty, tags } = req.body;
  
  if (!question || !answer || !subject) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const flashcards = await readJSONFile(FLASHCARDS_FILE) || [];
  
  const newFlashcard = {
    id: uuidv4(),
    question,
    answer,
    subject,
    difficulty: difficulty || 'medium',
    tags: tags || [],
    created: new Date().toISOString(),
    timesReviewed: 0,
    correctCount: 0,
    lastReviewed: null
  };

  flashcards.push(newFlashcard);
  
  const success = await writeJSONFile(FLASHCARDS_FILE, flashcards);
  if (!success) {
    return res.status(500).json({ error: 'Failed to save flashcard' });
  }

  res.status(201).json(newFlashcard);
});

app.put('/api/flashcards/:id', async (req, res) => {
  const { id } = req.params;
  const { question, answer, subject, difficulty, tags } = req.body;
  
  const flashcards = await readJSONFile(FLASHCARDS_FILE) || [];
  const cardIndex = flashcards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }

  flashcards[cardIndex] = {
    ...flashcards[cardIndex],
    question,
    answer,
    subject,
    difficulty,
    tags,
    updated: new Date().toISOString()
  };

  const success = await writeJSONFile(FLASHCARDS_FILE, flashcards);
  if (!success) {
    return res.status(500).json({ error: 'Failed to update flashcard' });
  }

  res.json(flashcards[cardIndex]);
});

app.delete('/api/flashcards/:id', async (req, res) => {
  const { id } = req.params;
  
  const flashcards = await readJSONFile(FLASHCARDS_FILE) || [];
  const filteredFlashcards = flashcards.filter(card => card.id !== id);
  
  if (filteredFlashcards.length === flashcards.length) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }

  const success = await writeJSONFile(FLASHCARDS_FILE, filteredFlashcards);
  if (!success) {
    return res.status(500).json({ error: 'Failed to delete flashcard' });
  }

  res.json({ message: 'Flashcard deleted successfully' });
});

// Update flashcard review stats
app.post('/api/flashcards/:id/review', async (req, res) => {
  const { id } = req.params;
  const { correct } = req.body;
  
  const flashcards = await readJSONFile(FLASHCARDS_FILE) || [];
  const cardIndex = flashcards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }

  flashcards[cardIndex].timesReviewed += 1;
  if (correct) {
    flashcards[cardIndex].correctCount += 1;
  }
  flashcards[cardIndex].lastReviewed = new Date().toISOString();

  const success = await writeJSONFile(FLASHCARDS_FILE, flashcards);
  if (!success) {
    return res.status(500).json({ error: 'Failed to update review stats' });
  }

  res.json(flashcards[cardIndex]);
});

// Subjects endpoints
app.get('/api/subjects', async (req, res) => {
  const subjects = await readJSONFile(SUBJECTS_FILE);
  if (subjects === null) {
    return res.status(500).json({ error: 'Failed to read subjects' });
  }
  res.json(subjects);
});

app.post('/api/subjects', async (req, res) => {
  const { name, icon, color } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Subject name is required' });
  }

  const subjects = await readJSONFile(SUBJECTS_FILE) || [];
  
  const newSubject = {
    id: uuidv4(),
    name,
    icon: icon || 'BookOpen',
    color: color || 'bg-blue-500',
    created: new Date().toISOString(),
    flashcardCount: 0
  };

  subjects.push(newSubject);
  
  const success = await writeJSONFile(SUBJECTS_FILE, subjects);
  if (!success) {
    return res.status(500).json({ error: 'Failed to save subject' });
  }

  res.status(201).json(newSubject);
});

// Progress endpoints
app.get('/api/progress', async (req, res) => {
  const progress = await readJSONFile(PROGRESS_FILE);
  if (progress === null) {
    return res.status(500).json({ error: 'Failed to read progress' });
  }
  res.json(progress);
});

app.put('/api/progress', async (req, res) => {
  const updates = req.body;
  
  const currentProgress = await readJSONFile(PROGRESS_FILE) || {
    totalXP: 0,
    level: 1,
    streak: 0,
    lastActivity: null,
    completedSkills: [],
    achievements: []
  };

  const updatedProgress = { ...currentProgress, ...updates };
  
  const success = await writeJSONFile(PROGRESS_FILE, updatedProgress);
  if (!success) {
    return res.status(500).json({ error: 'Failed to update progress' });
  }

  res.json(updatedProgress);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'STEM Tutor Backend is running' });
});

app.listen(PORT, () => {
  console.log(`STEM Tutor Backend running on http://localhost:${PORT}`);
});