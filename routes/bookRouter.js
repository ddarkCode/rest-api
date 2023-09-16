/* eslint-disable no-underscore-dangle */
const { Router } = require('express');
const debug = require('debug')('app:bookRouter');

function router(Book) {
  const bookRoutes = Router();

  bookRoutes.route('/books').get(async (req, res) => {
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    try {
      const books = await Book.find(query);
      return res.status(200).json(books);
    } catch (err) {
      return debug(err);
    }
  })
    .post(async (req, res) => {
      const { body } = req;
      try {
        const newBook = new Book(body);
        await newBook.save();
        return res.status(201).json(newBook);
      } catch (err) {
        return debug(err);
      }
    });

  bookRoutes.route('/books/:bookId')
    .all(async (req, res, next) => {
      const { bookId } = req.params;
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(404).json({ message: 'Book Not Found.' });
        }
        req.book = book;
        return next();
      } catch (err) {
        debug(err);
        return res.status(500);
      }
    })
    .get(async (req, res) => res.status(200).json(req.book))
    .put(async (req, res) => {
      const { book } = req;
      if (req.body._id) {
        delete req.body._id;
      }
      book.title = req.body.title;
      book.author = req.body.author;
      book.read = req.body.read;
      book.genre = req.body.genre;
      try {
        await book.save();
        return res.status(201).json(book);
      } catch (err) {
        debug(err);
        return res.status(500).json(err);
      }
    })
    .patch(async (req, res) => {
      const { book } = req;
      try {
        Object.entries(req.body).forEach((keyValue) => {
          const [key, value] = keyValue;
          book[key] = value;
        });
        await book.save();
        return res.status(201).json(book);
      } catch (err) {
        debug(err);
        return res.status(500).json(err);
      }
    })
    .delete(async (req, res) => {
      try {
        await Book.deleteOne({ _id: req.params.bookId });
        return res.status(204).json({ message: 'Book Successfullyy Deleted' });
      } catch (err) {
        debug(err);
        return res.status(500).json(err);
      }
    });

  return bookRoutes;
}

module.exports = router;
