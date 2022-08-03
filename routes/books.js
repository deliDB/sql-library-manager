const express = require('express');
const router = express.Router();
const Book  = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET full list of books */
router.get('/', asyncHandler(async (req, res) => {  
    const books = await Book.findAll();
    res.render('index', { books, title: 'Books' });
}));

/* GET book detail form */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    res.render('update-book', { book, title: book.title });
  } else {
    res.render('page-not-found');
  }
}));

/* POST updates book info */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      res.redirect('/');
    } else {
      res.render('page-not-found');
    }
  } catch(error){
    if(error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      book.id = req.params.id; //ensures correct book is updated
      res.render('update-book', { book, errors: error.errors, title: 'Update Book' })
    } else {
      throw error;
    }
  }
}));

/* GET new book form */
router.get('/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book'});
}));

/* POST new book to the database */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/');
  } catch(error){
    if(error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title: 'New Book' })
    } else {
      throw error;
    }
  }
}));

/* POST deletes book from database */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect('/');
  } else {
    res.render('page-not-found');
  }
}));




/**
 * 
get /books/new - Shows the create new book form
post /books/new - Posts a new book to the database
get /books/:id - Shows book detail form
post /books/:id - Updates book info in the database
post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting
 */

module.exports = router;