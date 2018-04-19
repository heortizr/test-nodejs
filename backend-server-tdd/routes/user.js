var express = require('express');
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var mdAuth = require('../middlewares/auth');

var app = express();


app.get('/', (req, res) => {

    var from = req.query.desde || 0;
    from = Number(from);

    User.find({}, 'name email img role google')
        .skip(from)
        .limit(5)
        .exec((err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            User.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    payload: users,
                    total: count
                });
            });
        });
});

app.put('/:id', [mdAuth.verifyToken, mdAuth.verifyUserRoleOnSelfUser], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: `error`,
                errs: { message: 'Error' }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            userSaved.password = '*******';

            res.status(200).json({
                ok: true,
                payload: userSaved
            });

        });

    });

});

app.post('/', (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        userSaved.password = '*****';

        res.status(201).json({
            ok: true,
            payload: userSaved
        });
    });

});

app.delete('/:id', [mdAuth.verifyToken, mdAuth.verifyAdminRole], (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            payload: userDeleted
        });
    });
});

module.exports = app;