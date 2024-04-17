const bcrypt = require('bcrypt');
const db = require('../database/database');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if(checkResult.rows.length === 0){
            return res.status(400).send({
                error: true,
                message: "Email atau password salah"
            })
        } else {
            const userPassword = checkResult.rows[0].password;
            const correctPassword = await bcrypt.compare(
                password,
                userPassword
            )
            if(!correctPassword){
                return res.status(400).send({
                    error: true,
                    message: "Email atau password salah"
                })
            }

            const userId = checkResult.rows[0].id;
            const userEmail = checkResult.rows[0].email;
            
            const token = jwt.sign({userId, userEmail}, process.env.MY_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: true
            });

            return res.status(200).send({
                error: false,
                message: "success",
                loginResult: {
                    id: userId,
                    email: userEmail,
                    token: token
                }
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    }
};

module.exports = login;