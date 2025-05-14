import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;
