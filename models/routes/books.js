const express = require('express');
const router = express.Router();
const Books = require('../models/Books');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let search = '';
let perPage = 5;

//This route will show all books
router.get('/', (req, res) => {
    if (req.query.page == null) search = '';
    if (req.query.search) {
        search = req.query.search;
        search = search.toLowerCase();
    }
    let match = {
        [Op.like]: `%${search}%`
    };
    Books.findAndCountAll({
            where: {
                [Op.or]: [{
                        title: match
                    },
                    {
                        author: match
                    },
                    {
                        genre: match
                    },
                    {
                        year: match
                    },
                ]
            },
            order: [
                ['title', 'ASC']
            ],
            limit: perPage,
            offset: req.query.page ? Number(req.query.page - 1) * perPage : 0
        })
        .then(books => {
            res.render('index', {
                books: books.rows,
                pages: Number(books.count / perPage),
            });
        })
        .catch(err => {
            throw err;
        });
});

// Renders form to create a new book.
router.get('/new', (req, res) => res.render('new-book'));

// Posts the users "create a new book" form data to database
router.post('/new', (req, res) => {
    search = '';
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
            // If title and/or author form fields are empty, form will not submit and page shows friendly error message.
            if (err.name === 'SequelizeValidationError') {
                res.render('new-book', {
                    errors: err.errors,
                });
            } else {
                throw err;
            }
        });
});

// Renders form to display book details, update the book details, or delete the book.
router.get('/:id', (req, res) => {
    Books.findByPk(req.params.id)
        .then(book =>
            res.render('update-book', {
                book
            }))
        .catch(err => {
            throw err;
        });
});

// Updates the book details if form data is sent by the user.
router.post('/:id', (req, res) => {
    Books.findByPk(req.params.id)
        .then(book => {
            return book.update(req.body);
        })
        .then(() => res.redirect('/'))
        .catch(err => {
            let book = Books.build(req.body);
            book.id = req.params.id;
            // If title and/or author form fields are empty, form will not submit and page shows friendly error message.
            if (err.name === 'SequelizeValidationError') {
                res.render('update-book', {
                    book,
                    errors: err.errors
                });
            } else {
                throw err;
            }
        });
});

// Deletes a book from the database.
router.post('/:id/delete', (req, res) => {
    Books.findByPk(req.params.id)
        .then(book => {
            return book.destroy();
        })
        .then(() => {
            search = '';
            res.redirect('/');
        })
        .catch(err => {
            throw err;
        });
});

module.exports = router;