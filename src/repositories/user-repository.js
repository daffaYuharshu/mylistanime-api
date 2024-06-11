const prisma = require("../database/prisma");

const findUser = async (email) => {
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    return user;
}

const insertUser = async (username, email, hash) => {
    await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hash
        }
    })
}

module.exports = { findUser, insertUser };