const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require("path");
const fs = require("fs");
const os = require('os');
dotenv.config();
const { findUserByEmail, findUserByUsername, insertUser, findUserProfile, editUserProfileWithImage, editUserProfileWithoutImage } = require('../repositories/user-repository');

const register = async (username, email, password) => {
    const emailIsExist = await findUserByEmail(email);
    const usernameIsExist = await findUserByUsername(username);

    if(emailIsExist){
        throw Error("Email telah terdaftar");
    } else if (usernameIsExist) {
        throw Error("Username telah digunakan");
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
    const user = await findUserByEmail(email);
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

const getUserProfile = async (username) => {
    const user = await findUserProfile(username);
    if (!user){
        throw Error("Profil tidak ditemukan")
    }
    return user;
}

const updateUserProfileWithImage = async (userId, image, desc, req, res) => {
    const imageSize = image.data.length;
    const extImage = path.extname(image.name);
    const imageName = image.md5 + extImage;
    // const urlImage = `${req.protocol}://${req.get("host")}/images/${imageName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if(!allowedType.includes(extImage.toLowerCase())) {
        throw Error("Ext gambar tidak valid");
    }

    if(imageSize > 1000000){
        throw Error("Gambar harus kurang dari 1 MB");
    }

    const urlPath = await uploadImage(image, imageName);
    const urlImage = `${req.protocol}://${req.get("host")}/images/${imageName}`;
    await editUserProfileWithImage(userId, {urlImage, desc})
}

// const uploadImage = (image, imageName) => {
//     return new Promise((resolve, reject) => {
//         const uploadPath = path.resolve(__dirname, `../public/images/${imageName}`);
        
//         // Pastikan direktori ada sebelum menyimpan file
//         const dirPath = path.dirname(uploadPath);
//         if (!fs.existsSync(dirPath)) {
//             fs.mkdirSync(dirPath, { recursive: true });
//         }

//         image.mv(uploadPath, (err) => {
//         if (err) {
//             reject(err);
//         } else {
//             // Check if file exists after upload
//             fs.access(uploadPath, fs.constants.F_OK, (err) => {
//             if (err) {
//                 reject(new Error('File not found after upload'));
//             } else {
//                 resolve();
//             }
//             });
//         }
//         });
//     });
// };

const uploadImage = (image, imageName) => {
    return new Promise((resolve, reject) => {
        // Gunakan direktori sementara untuk menyimpan file
        const tempDir = os.tmpdir();
        const uploadPath = path.join(tempDir, imageName);

        image.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            } else {
                // Check if file exists after upload
                fs.access(uploadPath, fs.constants.F_OK, (err) => {
                    if (err) {
                        reject(new Error('File not found after upload'));
                    } else {
                        resolve(uploadPath);
                    }
                });
            }
        });
    });
};

const updateUserProfileWithoutImage = async (userId, desc) => {
    await editUserProfileWithoutImage(userId, desc);
}

module.exports = { register, login, getUserProfile, updateUserProfileWithImage, updateUserProfileWithoutImage };