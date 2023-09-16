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

  bookRoutes.route('/books/:bookId').get(async (req, res) => {
    const { bookId } = req.params;
    try {
      const book = await Book.findById(bookId);
      return res.status(200).json(book);
    } catch (err) {
      return debug(err);
    }
  });

  return bookRoutes;
}

module.exports = router;
