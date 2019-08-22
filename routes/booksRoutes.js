const express = require('express');
const router = express.Router();
const Books = require('../models/Books');
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "library.db"
})
//const Op = Sequelize.Op;
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database successful!');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
})();

//This route will show all books
router.get('/', (req, res) => {
    Books.findAll()
        .then(books => {
            res.render('index', {
                books: books
            });
        })
        .catch(err =>
            console.log(err))
});

// Renders form to create a new book.
router.get('/new', (req, res) => res.render('new-book'));

// Posts the users "create a new book" form data to database
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
            // If title and/or author form fields are empty, form will not submit and page shows friendly error message.
            if (err.name === 'SequelizeValidationError') {
                res.render('new-book', {
                    err: err.errors,
                });
            } else {
                throw err;
            }
        })
        .catch(err => console.log(err))
});



router.get('/search', (req, res) => {
    const {
        term
    } = req.query;

    Books.findAll({
            where: {
                [Op.or]: [{

                        title: {
                            [Op.like]: '%' + term + '%'
                        }
                    },
                    {
                        author: {
                            [Op.like]: '%' + term + '%'
                        }
                    },
                    {
                        genre: {
                            [Op.like]: '%' + term + '%'
                        }
                    },
                    {
                        year: {
                            [Op.like]: '%' + term + '%'
                        }
                    }


                ]
            }
        })
        .then(books => {
            res.render('search-results', {
                books,
                term
            });
        })
        .catch(err => console.log(err));
});
router.post('/:id/delete', (req, res) => {
    Books.findByPk(req.params.id)
        .then(Book => {
            if (Book) {
                return Book.destroy();
            } else {
                res.render('error');
            }
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
});

// Updates the book details if form data is sent by the user.
router.get('/:id', (req, res) => {
    Books.findByPk(req.params.id)
        .then(book => {
            res.render('update-book', {
                book
            });
        })
        .catch(err => console.log(err))
});
router.post('/:id', (req, res) => {
    Books.findByPk(req.params.id)
        .then(Book => {
            if (Book) {
                return Book.update(req.body);
            } else {
                res.render('error');
            }
        })
        .then(() => res.redirect('/'))
        .catch(err => {
            if (err.name === "SequelizeValidationError") {
                let book = Books.build(req.body);
                book.dataValues.id = req.params.id;
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


module.exports = router;