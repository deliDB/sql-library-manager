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
router.get('/books/new', asyncHandler(async () => {

}));


/* POST updates book info in the database */

/* GET new book form */

/* POST new book to the database */

/* POST deletes book from database */





/**
 * 
get /books/new - Shows the create new book form
post /books/new - Posts a new book to the database
get /books/:id - Shows book detail form
post /books/:id - Updates book info in the database
post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting
 */

module.exports = router;