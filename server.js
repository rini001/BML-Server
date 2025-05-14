import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import Book from './models/Book.js';
import myBooksRoutes from './routes/myBooksRoutes.js';
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://bml-client.vercel.app/', // frontend URL
  credentials: true,
}));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);

app.use('/api/books', bookRoutes);
app.use('/api/mybooks', myBooksRoutes);

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Seed books if empty
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      const sampleBooks = [
        {
          title: "The Pragmatic Programmer",
          author: "Andrew Hunt & David Thomas",
          coverImage: "https://placehold.co/300x300/FF5733/FFFFFF?text=The+Pragmatic+Programmer",
          availability: true
        },
        {
          title: "Clean Code",
          author: "Robert C. Martin",
          coverImage: "https://placehold.co/300x300/3498DB/FFFFFF?text=Clean+Code",
          availability: true
        }
      ];
      await Book.insertMany(sampleBooks);
      console.log('📚 Sample books inserted on first run');
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });