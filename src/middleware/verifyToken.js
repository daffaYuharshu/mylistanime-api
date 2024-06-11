const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; 
        if(!token){
            return res.sendStatus(401);
        }
        const user = jwt.verify(token, process.env.MY_SECRET);
        req.userId = user.userId;
        next();
        
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    }
};

module.exports = verifyToken;