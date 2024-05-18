const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { findUser, insertUser } = require('../repositories/user-repository');

const register = async (email, password) => {
    const user = await findUser(email);
    
    if(user){
        throw Error("Email telah terdaftar");
    }else{
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async(err, hash) => {
            if(err){
                throw Error("Error hashing password");
            }else{
                await insertUser(email, hash)
            }
        })

    }
}

const login = async (email, password) => {
    const user = await findUser(email);
    if(!user){
        throw Error("Email atau password salah");
    }

    const userPassword = user.password;
    const correctPassword = await bcrypt.compare(
        password,
        userPassword
    )

    if(!correctPassword){
        throw Error("Email atau password salah");
    }

    const userId = user.id;
    const userEmail = user.email;

    const token = jwt.sign({userId, userEmail}, process.env.MY_SECRET, { expiresIn: "1h" });

    const loginInfo = {
        id: userId,
        email: userEmail,
        token: token
    }

    return loginInfo;
    
}

module.exports = { register, login };