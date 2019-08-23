// /* GET home route */
router.get('/', (req, res) => {
    res.redirect("/books/page/1");
});

/* GET books listing + pagination */
router.get('/books/page/:NumOfPages', (req, res, next) => {

    const NumOfPages = req.params.NumOfPages;
    const limit = 8;
    const offset = limit * (NumOfPages - 1);

    Book.findAndCountAll({
            limit: limit,
            offset: offset
        })
        .then(books => {
            const AmtOfPages = Math.ceil(books.count / limit);
            res.render("index", {
                books: books.rows,
                AmtOfPages: AmtOfPages
            });
        })
        .catch(err => {
            const error = new Error('Server Error');
            error.status = 500;
            next(error);
        });
});

/* GET search route. */
router.get('/books/search', (req, res, next) => {
    const query = req.query.search;
    if (query === '') {
        res.redirect('/books/page/1');
    } else {
        Book.findAll({
                where: {
                    [Op.or]: [{
                            title: {
                                [Op.like]: `%${query}%`
                            }
                        },
                        {
                            author: {
                                [Op.like]: `%${query}%`
                            }
                        },
                        {
                            genre: {
                                [Op.like]: `%${query}%`
                            }
                        },
                        {
                            year: {
                                [Op.like]: `%${query}%`
                            }
                        },
                    ]
                }
            })
            .then(books => {
                res.render("index", {
                    books: books,
                    query: query
                });
            })
            .catch(err => {
                const error = new Error('Server Error');
                error.status = 500;
                next(error);
            });
    }

})


// /* Create a new book form. */
// router.get('/books/new', (req, res, next) => {
//     res.render("new-book", {
//         book: Book.build(),
//         title: "New Book"
//     });
// });



/* GET individual book. */
router.get("/books/:id", (req, res, next) => {
    Book.findByPk(req.params.id)
        .then(book => {
            if (book) {
                res.render("update-book", {
                    book: book,
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    year: book.year
                });
            } else {
                throw error;
            }
        })
        .then()
        .catch(err => {
            const error = new Error('Server Error');
            error.status = 500;
            next(error);
        });
});

/* POST update book. */
router.post("/books/:id", (req, res, next) => {
    Book.update({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            year: req.body.year

        }, {
            where: {
                id: req.params.id
            }

            // .then(book => {
            //   if(book) {
            //     return book.update(req.body);
            //   } else {
            //     res.send(404);
            //   }
        }).then(() => {
            res.redirect("/books/page/1");
        })
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                const book = Book.build(req.body);
                book.id = req.params.id;
                res.render("update-book", {
                    book: book,
                    errors: error.errors,
                    title: "Update Book"
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


//error handler middleware
router.use((err, req, res, next) => {
    res.render('error', {
        error: err
    });
    console.log(`There was an error with the application. ${err}`);
});


// 404 error middleware
router.use((req, res) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    res.render('page-not-found', {
        error
    });
});


module.exports = router;