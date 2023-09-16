/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const debug = require('debug')('app');
const { connect } = require('mongoose');

const Book = require('./models/bookModel');

const app = express();

(async function mongo() {
  try {
    await connect('mongodb://127.0.0.1:27017/bookDB');
  } catch (err) {
    debug(err);
  }
}());

const bookRouter = express.Router();

bookRouter.route('/books').get(async (req, res) => {
  const query = {};
  if (req.query.genre) {
    query.genre = req.query.genre;
  }
  try {
    const books = await Book.find(query);
    return res.json(books);
  } catch (err) {
    debug(err);
  }
});

bookRouter.route('/books/:bookId').get(async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Book.findById(bookId);
    return res.json(book);
  } catch (err) {
    debug(err);
  }
});

app.use('/api', bookRouter);

app.listen(3000, () => debug('App running on port 3000.'));
