const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    let token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied!');

    if(token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token!');
    }
}