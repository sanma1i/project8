const express = require('express');
const app = express();
//const db = require('./config/database');


app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use('/static', express.static('public'));
app.use('/books', require('./routes/booksRoutes'));

//Setting HTML to view engine  to use pug
app.set('view engine', 'pug');

//Redirects browser to the /books route
app.get('/', (req, res) => res.redirect('/books'));

//Logs 404 error to console when user navigates to non-existing route
app.use((req, res) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    console.error(err);
    res.status(404);
    res.render('page-not-found');
});
//Logs server error
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.render('error');
});
//Localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`The application is running on http://localhost:${PORT}`));