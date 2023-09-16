/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const debug = require('debug')('app');
const { connect } = require('mongoose');
const morgan = require('morgan');

const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

(async function mongo() {
  try {
    await connect('mongodb://127.0.0.1:27017/bookDB');
  } catch (err) {
    debug(err);
  }
}());

app.use('/api', bookRouter(Book));

app.listen(3000, () => debug('App running on port 3000.'));
