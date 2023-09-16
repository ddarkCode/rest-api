/* eslint-disable no-underscore-dangle */
const { Router } = require('express');

const controllers = require('../controllers/booksController');

function router(Book) {
  const bookRoutes = Router();
  const {
    getBooks, PostBook, getBookById, putBook, patchBook, deleteBook, bookByIdMiddleware,
  } = controllers(Book);

  bookRoutes.route('/books').get(getBooks)
    .post(PostBook);

  bookRoutes.route('/books/:bookId')
    .all(bookByIdMiddleware)
    .get(getBookById)
    .put(putBook)
    .patch(patchBook)
    .delete(deleteBook);

  return bookRoutes;
}

module.exports = router;
