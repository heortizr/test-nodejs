var express = require('express');
var Hospital = require('../models/hospital');
var mdAuth = require('../middlewares/auth');

var app = express();

app.get('/', (req, res) => {

    var from = req.query.from || 0;
    from = Number(from);

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('_user', 'name email')
        .exec((err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    payload: hospitals,
                    total: conteo
                });
            });
        });

});

app.get('/:id', (req, res) => {

    let id = req.params.id;

    Hospital.findById(id)
        .populate('_user', 'name img email')
        .exec((err, hospital) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: `Error`,
                    errs: { message: 'Error' }
                });
            }

            res.status(200).json({
                ok: true,
                payload: hospital
            });
        });

});

app.put('/:id', mdAuth.verifyToken, (req, res) => {

    var id = req.params.id;
    var user = req.user;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'Error',
                errs: { message: 'Error' }
            });
        }

        hospital.name = body.name;
        hospital._user = user._id;

        hospital.save((err, hospitalSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            res.status(200).json({
                ok: true,
                payload: hospitalSaved
            });
        });
    });
});

app.post('/', mdAuth.verifyToken, (req, res) => {

    var body = req.body;
    var user = req.user;

    var hospital = new Hospital({
        name: body.name,
        _user: user._id
    });

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(201).json({
            ok: true,
            payload: hospitalSaved
        });
    });
});

app.delete('/:id', mdAuth.verifyToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            payload: hospitalDeleted
        });
    });
});

module.exports = app;