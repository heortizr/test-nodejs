let mongoose = require('mongoose');
let Book = require('./../models/book');

// GET /book to retrieve all books
function getBooks(req, res) {
    // query db and if no errers, send all the books
    let query = Book.find({});
    query.exec( (err, books) => {
        if (err) res.status(500).send(err);
        // if no errors, send them back to the client
        res.status(200).json(books);
    });
}

// POST /book to save a new book
function postBook(req, res) {
    // create a new book
    let newBook = new Book(req.body);
    // save into the db
    newBook.save( (err, book) => {
        if (err) { 
            res.status(500).send(err);
        } else {
            res.status(200).json({
                message: 'Book successfully added!',
                book
            });
        }
    });
}

// GET /book/:id route to retrieve a book given its id.
function getBook(req, res) {
    Book.findById(req.params.id, (err, book) => {
        if(err) res.status(500).send(err);
        //If no errors, send it back to the client
        res.status(200).json(book);
    });     
}

// DELETE /book/:id to delete a book given its id
function deleteBook(req, res) {
    Book.remove({ _id: req.params.id }, (err, result) => {
        res.status(200).json({ message: 'Book successfully deleted!', result });
    });
}

// PUT /book/:id to update a book given its id
function updateBook(req, res) {
    Book.findById({ _id: req.params.id }, (err, book) => {
        if (err) res.status(500).send(err);
        Object.assign(book, req.body).save( (err, book) => {
            if (err) res.status(500).send(err);
            res.json({ message: 'Book successfully updated!', book });
        });
    });
}

// export all the functions
module.exports = {
    getBooks,
    getBook,
    postBook,
    deleteBook,
    updateBook
}