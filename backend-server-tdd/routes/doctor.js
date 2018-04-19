let express = require('express');
let Doctor = require('../models/doctor');
let mdAuth = require('../middlewares/auth');

let app = express();

// =======================================
// Retrieve all doctors
// =======================================
app.get('/', (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    Doctor.find({})
        .skip(from)
        .limit(5)
        .populate('_user', 'name email')
        .populate('_hospital')
        .exec((err, doctors) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            Doctor.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    payload: doctors,
                    total: count
                });
            });
        });
});

// =======================================
// Retrieve a doctor
// =======================================
app.get('/:id', (req, res) => {

    let id = req.params.id;
    Doctor.findById(id)
        .populate('_user', 'name email img')
        .populate('_hostpital')
        .exec((err, doctor) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding doctor',
                    errs: err
                });
            }

            if (!doctor) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error',
                    errs: { message: 'Error' }
                    });
            }

            return res.status(200).json({
                ok: true,
                payload: doctor
            });

        });

});

// =======================================
// Edit a doctor
// =======================================
app.put('/:id', mdAuth.verifyToken, (req, res) => {

    let id = req.params.id;
    let user = req.user;
    let body = req.body;

    Doctor.findById(id, (err, doctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding doctor',
                errs: err
            });
        }

        if (!doctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error',
                errs: { message: 'Error' }
            });
        }

        doctor.name = body.name;
        doctor._user = user._id;
        doctor._hospital = body.hospital;

        doctor.save((err, doctorSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            res.status(200).json({
                ok: true,
                payload: doctorSaved
            });
        });

    });

});

// =======================================
// create a new doctor
// =======================================
app.post('/', mdAuth.verifyToken, (req, res) => {

    let body = req.body;
    let user = req.user;

    let doctor = new Doctor({
        name: body.name,
        _user: user._id,
        _hospital: body.hospital
    });

    doctor.save((err, doctorSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(201).json({
            ok: true,
            payload: doctorSaved
        });
    });
});

// =======================================
// deleta a doctor
// =======================================
app.delete('/:id', mdAuth.verifyToken, (req, res) => {

    let id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, doctorSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            payload: doctorSaved
        });
    });

});

module.exports = app;