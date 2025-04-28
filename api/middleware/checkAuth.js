const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, 'sbs online classes 123');
        console.log(verify); // ✅ Fix: 'verify' was not declared earlier
        next();
    } catch (err) {
        return res.status(401).json({
            msg: "invalid token"
        });
    }
};
