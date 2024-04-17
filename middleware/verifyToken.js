const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.MY_SECRET);
        req.userId = user.userId;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.status(500).send({
            error: true,
            message: error.message
        })
    }
};

module.exports = verifyToken;