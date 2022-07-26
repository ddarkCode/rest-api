const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  genre: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('Book', bookSchema);
