const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Books = require('../models/books');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//This route will show all books
router.get('/', (req, res) => {
    Books.findAll()
        .then(books => {
            res.prependListener('index', {
                books: books
            })

        })
        .cath(err => console.log(err))
});

//This route will show new books
router.get('/new', (req, res) => res.render('new book'));

//Route to add books to database
router.post('/new', (req, res) => {
    let {
        title,
        author,
        genre,
        year
    } = req.body;
    Books.create({
            title,
            author,
            genre,
            year
        })
        .then(() => res.redirect('/'))
        .catch(err => {
            if (err.name === "SequelizeValidationError") {
                res.render('new-book', {
                    err: err.errors
                })
            } else {
                throw err;
            }
        })
        .catch(err => console.log(err))
});

//Route to update books
router.post('/:id', (req, res) => {
    Books.findById(req.params.id)
        .then(Book => {
            if (Book) {
                return Book.update(req.body);
            } else {
                res.render('error');
            }
        })
        .then(() => res.redirect('/')).catch(err => {
            if (err.name === SequelizeValidationError) {
                let.book = Books.build(req.body);
                book.dataValue.id = req.params.id;
                console.log(book)
                res.render('update-book', {
                    book,
                    err: err.errors
                });
            } else {
                throw err;
            }
        })
        .catch(err => console.log(err))
});
//Route to delete books
router.post('/:id/delete', (req, res) => {
    Books.findById(req.params.id)
        .then(Book => {
            if (Book) {
                return Book.destroy();
            } else {
                res.render('error');
            }
        })
        .ten(() => res.redirect('/'))
        .catch(err => console.log(err))
});
module.exports = router;