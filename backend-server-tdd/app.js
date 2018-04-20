// require
let express         = require('express');
let mongoose        = require('mongoose');
let bodyParser      = require('body-parser');
let config          = require('config');

// routes import
let userRoutes      = require('./routes/user');
let hospitalRoutes  = require('./routes/hospital');
let doctorRoutes    = require('./routes/doctor');
/*
let searchRoutes    = require('./routes/search');
let loginRoutes     = require('./routes/login');
let uploadRoutes    = require('./routes/upload');
let imageRoutes     = require('./routes/image');
*/
let appRuotes       = require('./routes/app');

// initialize
let app = express();

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

// db connection
mongoose.connection.openUri(config.DBConfig, (err, res) => {
    if (err) throw err;
    console.log('mongoDB \x1b[32m%s\x1b[0m', 'online');
});

// rutas
app.use('/api/user', userRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/doctor', doctorRoutes);
/*
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/img', imageRoutes);
app.use('/api/login', loginRoutes);
*/
app.use('/', appRuotes);

// listener de peticiones
app.listen(process.env.PORT || 3000, () => {
    console.log('Express is running on port \x1b[32m%s\x1b[0m', (process.env.PORT || 3000));
});

module.exports = app;