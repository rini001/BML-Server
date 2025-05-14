import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// Public route to get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;

