const jwt = require('jsonwebtoken');

let authGuard = (req, res, next) => {
    let token = req.get('Authorization');
    if (token) {
        jwt.verify(token, process.env.USER_SECRET, (err, decoded) => {
            err ? res.status(403).json(err) : next();
        });
    }
    res.status(400).json({
        message: 'Request missing appropriate headers'
    })
}

let adminGuard = (req, res, next) => {
    let token = req.get('JWTAUTH');
    if (token) {
        jwt.verify(token, process.env.ADMIN_SECRET, (err, decoded) => {
            err ? res.status(403).json(err) : next();
        });
    }
    res.status(400).json({
        message: 'Request missing appropriate headers'
    })
}

let ictGuard = (req, res, next) => {
    let token = req.get('JWTAUTH');
    if (token) {
        jwt.verify(token, process.env.ICT_SECRET, (err, decoded) => {
            err ? res.status(403).json(err) : next();
        });
    }
    res.status(400).json({
        message: 'Request missing appropriate headers'
    })
}

module.exports = {
    authGuard,
    adminGuard,
    ictGuard
}