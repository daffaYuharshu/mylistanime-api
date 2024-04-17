const bcrypt = require('bcrypt');
const db = require('../database/database');

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if(checkResult.rows.length > 0){
            return res.status(400).send({
                error: true,
                message: "Email telah terdaftar"
            });
        }else{
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async(err, hash) => {
                if(err){
                    return res.status(500).send({
                        error: true,
                        message: "Error hashing password"
                    })
                }else{
                    await db.query(
                        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, hash]
                    );
                    return res.status(201).send({
                        error: false,
                        message: "Akun berhasil dibuat"
                    })
                }
            })
        }
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    }
}

module.exports = register;