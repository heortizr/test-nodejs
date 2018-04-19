let jwt = require('jsonwebtoken');
let config = require('config');

// =======================================
// verify user token
// =======================================
module.exports.verifyToken = (req, res, next) => {

    var token = req.query.token;
    jwt.verify(token, config.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Invalid Token',
                errs: err
            });
        }

        req.user = decoded.user;
        next();
    });
};

// =======================================
// verify user role
// =======================================
module.exports.verifyAdminRole = (req, res, next) => {

    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Incorrect Role',
            errs: { message: 'It is not an administrator' }
        });
    }
};

// =======================================
// verify user role on self user
// =======================================
module.exports.verifyUserRoleOnSelfUser = (req, res, next) => {

    let user = req.user;
    let id = req.params.id;

    if (user.role === 'ADMIN_ROLE' || id === user._id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Incorrect Role',
            errs: { message: 'It is not an administrator' }
        });
    }
};