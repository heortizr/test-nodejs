let express = require('express');
let User = require('../models/user');
let bcrypt = require('bcryptjs');
let mdAuth = require('../middlewares/auth');

let app = express();


app.get('/', (req, res) => {

    let from = req.query.desde || 0;
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

app.get('/:id', (req, res) => {

    let id = req.params.id;

    User.findById(id, 'name email img role google')
        .exec((err, user) => {

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
                    message: 'Error',
                    errs: { message: 'Error' }
                });
            }

            res.status(200).json({
                ok: true,
                payload: user,
            });
        });
});

app.put('/:id', [mdAuth.verifyToken, mdAuth.verifyUserRoleOnSelfUser], (req, res) => {

    let id = req.params.id;
    let body = req.body;

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

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userSaved) => {
        if (err) {
            return res.status(500).json({
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

    let id = req.params.id;

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