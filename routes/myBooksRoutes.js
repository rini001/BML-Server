import express from 'express';
import MyBook from '../models/MyBook.js';
import Book from '../models/Book.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/mybooks - fetch user's saved books
router.get('/', authMiddleware, async (req, res) => {
  try {
    const myBooks = await MyBook.find({ userId: req.user.id }).populate('bookId');
    res.json({ myBooks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/mybooks/:bookId - add a book to user's list
router.post('/:bookId', authMiddleware, async (req, res) => {
  try {
    const existing = await MyBook.findOne({ userId: req.user.id, bookId: req.params.bookId });
    if (existing) return res.status(400).json({ message: 'Book already added to your list.' });

    const myBook = new MyBook({
      userId: req.user.id,
      bookId: req.params.bookId
    });
    await myBook.save();
    res.status(201).json({ message: 'Book added to your list.', myBook });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/mybooks/:bookId/status - update reading status
router.patch('/:bookId/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ['Want to Read', 'Currently Reading', 'Read'];
    if (!validStatus.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const updated = await MyBook.findOneAndUpdate(
      { userId: req.user.id, bookId: req.params.bookId },
      { status },
      { new: true }
    );

    res.json({ message: 'Status updated.', myBook: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/mybooks/:bookId/rating - update rating
router.patch('/:bookId/rating', authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1 to 5' });

    const updated = await MyBook.findOneAndUpdate(
      { userId: req.user.id, bookId: req.params.bookId },
      { rating },
      { new: true }
    );

    res.json({ message: 'Rating updated.', myBook: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
