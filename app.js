const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('.config/database')

//Setting HTML to view 
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/static', express.static('public'));

//Test database
db.authenticate()
    .then(() => console.log('connected'))
    .catch(err => console.log('Error: ' + err))
//Redirects browser to the /books route
app.get('/', (res) =>
    res.redirect('/index')
);
//Books route
app.use('/index', require('./routes/index'));


//Logs 404 error to console
app.use((req, res) => {
    const err = new Error('Page Not Found');
    err.status(404);
    res.render('page-not-found');
});
//Logs server error
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.status);
    if (err.status === undefined) {
        console.log('Error 500-Internal Server Error')
    }
    res.render('error', {
        error: err
    })
})

db.sync()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => console.log('Application running on localhost:3000'));
    });