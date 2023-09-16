// eslint-disable-next-line import/no-extraneous-dependencies
const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: {
    type: String,
    author: String,
    genre: String,
    read: false,
  },
});

module.exports = model('Book', bookSchema);
