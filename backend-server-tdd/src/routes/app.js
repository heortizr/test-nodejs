let express = require('express');

let app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: ('It is works!'),
        payload: ({})
    });
});

module.exports = app;