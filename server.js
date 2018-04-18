let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let book = require('./app/routes/book');

// load the db location from the JSON
let config = require('config');

// db options
/*
let options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
}
*/

// db connection
//mongoose.connect(config.DBHost, options);
mongoose.connect(config.DBHost);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// don't show the log when it is test
if ( config.util.getEnv('NODE_ENV') !== 'test' ) {
    // use morgan to log at command line
    // 'combined' outputs the Apache style LOGs
    app.use(morgan('combined'));
}

// parse application/json and look for rar text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

app.get('/', (req, res) => res.json({ message: 'Welcome to our backend!' }) );

app.route('/book')
    .get(book.getBooks)
    .post(book.postBook);

app.route('/book/:id')
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

app.listen( process.env.PORT || 3000 );
console.log('I am listening on port ', ( process.env.PORT || 3000 ));

// for testing
module.exports = app;
