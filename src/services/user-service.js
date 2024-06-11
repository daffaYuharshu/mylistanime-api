const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { findUser, insertUser } = require('../repositories/user-repository');

const register = async (username, email, password) => {
    const user = await findUser(email);
    
    if(user){
        throw Error("Email telah terdaftar");
    }else{
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async(err, hash) => {
            if(err){
                throw Error("Error hashing password");
            }else{
                await insertUser(username, email, hash)
            }
        })

    }
}

const login = async (email, password) => {
    const user = await findUser(email);
    if(!user){
        throw Error("Email belum terdaftar");
    }

    const userPassword = user.password;
    const correctPassword = await bcrypt.compare(
        password,
        userPassword
    )

    if(!correctPassword){
        throw Error("Password salah");
    }

    const userId = user.id;
    const username = user.username;
    const userEmail = user.email;

    const token = jwt.sign({userId, userEmail}, process.env.MY_SECRET, { expiresIn: "1h" });

    const loginInfo = {
        id: userId,
        username: username,
        email: userEmail,
        token: token
    }

    return loginInfo;
    
}

module.exports = { register, login };