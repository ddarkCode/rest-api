// eslint-disable-next-line import/no-extraneous-dependencies
const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: String,
  author: String,
  genre: String,
  read: { type: Boolean, default: false },
});

module.exports = model('Book', bookSchema);
