const express = require('express'); // require express
const router = express.Router(); // starts an express application
const Books = require('../models/books'); // require the Book model
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/', (req, res) => {
    Books.findAll()
        .then(books => {
            res.render('index', {
                books: books
            });
        })
        .catch(err => console.log(err))
});


router.get('/new', (req, res) => res.render('new-book'));

/* POST create book. */
router.post('/new', (req, res, next) => {
    Books.create({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            year: req.body.year
        })

        .then(book => {
            res.redirect("/books");
        })
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                res.render("new-book", {
                    book: Book.build,
                    errors: error.errors,
                    title: "New Book"
                })
            } else {
                throw error;
            }
        })
        .catch(err => {
            const error = new Error('Server Error');
            error.status = 500;
            next(error);
        });
});



router.get("/:id", (req, res, next) => {
    Books.findByPk(req.params.id)
        .then(book => {
            if (book) {
                res.render("update-book", {
                    book: book,
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    year: book.year
                })
            }
        })

        .catch(err => {
            const error = new Error('Server Error');
            error.status = 500;
            next(error);
        });
});


/* POST update book. */
router.post("/:id", (req, res, next) => {
    Books.findByPk(req.params.id)
        .then(function (book) {
            if (book) {
                return book.update(req.body);
            }
        })
        .then(() => {
            res.redirect("/books");
        })
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                const book = Book.build(req.body);
                book.id = req.params.id;
                res.render("update-book", {
                    book: book,
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    year: book.year,
                    errors: err.errors
                })
            } else {
                throw error;
            }
        })
        .catch((err) => {
            const error = new Error('Server Error');
            error.status = 500;
            next(error);
        })
});


/* DELETE individual book. */
router.post("/:id/delete", (req, res, next) => {
    Books.findByPk(req.params.id)
        .then(book => {
            if (book) {
                return book.destroy();
            } else {
                res.send(404);
            }
        })
        .then(() => {
            res.redirect("/books");
        })
        .catch(err => {
            const error = new Error('Server Error');
            error.status = 500;
            next(error);
        });
});





module.exports = router;