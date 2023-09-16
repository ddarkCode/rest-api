/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const debug = require('debug')('app:booksController');

function controllers(Book) {
  const getBooks = async (req, res) => {
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    try {
      const books = await Book.find(query);
      const returnedBooks = books.map((book) => {
        book = book.toJSON();
        book.links = {};
        book.links.selfLink = `http://${req.headers.host}/api/books/${book._id}`;
        return book;
      });
      return res.status(200).json(returnedBooks);
    } catch (err) {
      return debug(err);
    }
  };

  const PostBook = async (req, res) => {
    const { body } = req;
    try {
      const newBook = new Book(body);
      await newBook.save();
      return res.status(201).json(newBook);
    } catch (err) {
      return debug(err);
    }
  };
  const bookByIdMiddleware = async (req, res, next) => {
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
  };
  const getBookById = async (req, res) => {
    const { book } = req;
    let { genre } = book;
    genre = genre.replace(' ', '%20');
    const returnedBook = book.toJSON();
    returnedBook.links = {};
    book.genre.replace(' ', '%20');
    returnedBook.links.filteredByGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
    res.status(200).json(returnedBook);
  };
  const putBook = async (req, res) => {
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
  };
  const patchBook = async (req, res) => {
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
  };
  const deleteBook = async (req, res) => {
    try {
      await Book.deleteOne({ _id: req.params.bookId });
      return res.status(204).json({ message: 'Book Successfullyy Deleted' });
    } catch (err) {
      debug(err);
      return res.status(500).json(err);
    }
  };
  return {
    getBooks,
    PostBook,
    getBookById,
    putBook,
    patchBook,
    deleteBook,
    bookByIdMiddleware,
  };
}

module.exports = controllers;
