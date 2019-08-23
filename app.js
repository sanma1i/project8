const express = require('express');
const Sequelize = require('sequelize')
const app = express();
const sqlite = require("sqlite3");
const path = require("path");
const db = require('./config/config');



app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


app.set("views", path.join(__dirname, "views"));
app.use('/static', express.static('public'));
app.use('/books', require('./routes/books'));

//Setting HTML to view engine  to use pug
app.set('view engine', 'pug');

//Redirects browser to the /books route
app.get('/', (req, res) => res.redirect('/books'));




//Logs 404 error to console when user navigates to non-existing route
app.use((req, res, next) => {
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
db.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`application is running on port ${PORT}`);
        });
    });