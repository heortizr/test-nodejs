// src/part1/tax.js
var request = require('request');

module.exports = {
    calculate: (subtotal, state, done) => {

        if ( state !== 'CA' ) {
            return done({ amount: 0 });
        }

        request.post({
            url: 'https://some-tax-service.com/request',
            method: 'POST',
            json: {
                subtotal: subtotal
            }
        }, ( err, res, body) => {
            done(body);
        });

    }
};
