const jwt = require("jsonwebtoken");

function verify(req, res, next) {

    const authHeaders = req.headers.token;
    if (authHeaders) {
        const token = authHeaders.split(" ")[1];

        // jwt verify
        jwt.verify(token, process.env.SEC_KEY, (err, user) => {
            if (err) res.status(403).json("Token is invalid!");
            req.user = user;
            next()
        })
    } else {
        res.status(401).json('You are not authenticated!')
    }

};

module.exports = verify;