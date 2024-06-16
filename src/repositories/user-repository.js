const prisma = require("../database/prisma");

const findUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    return user;
}

const findUserByUsername = async (username) => {
    const user = await prisma.user.findUnique({
        where:{
            username: username
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

const findUserProfile = async (username) => {
    const user = await prisma.user.findUnique({
        where :{
            username : username 
        }
    }) 
    return user;
}

const editUserProfileWithImage = async (userId, data) => {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            image: data.urlImage,
            desc: data.desc
        }
    })
}

const editUserProfileWithoutImage = async (userId, desc) => {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            desc: desc
        }
    })
}

module.exports = { findUserByEmail, findUserByUsername, insertUser, findUserProfile, editUserProfileWithImage, editUserProfileWithoutImage };