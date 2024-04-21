const jwt = require('jsonwebtoken');
const db = require('../database/database');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        let token = req.cookies.token; 
        if(!token){
            return res.sendStatus(401);
        }else{
            const user = jwt.verify(token, process.env.MY_SECRET);
            // console.log(user);
            req.userId = user.userId;
            next();
        }
    } catch (error) {
        res.clearCookie("token");
        return res.status(500).send({
            error: true,
            message: error.message
        })
    }
};

module.exports = verifyToken;