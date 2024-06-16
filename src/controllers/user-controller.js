const express = require("express");
const prisma = require("../database/prisma");
const dotenv = require('dotenv');
dotenv.config();

const { register, login, getUserProfile, updateUserProfileWithImage, updateUserProfileWithoutImage } = require("../services/user-service");
const verifyToken = require("../middleware/verifyToken");
const { use } = require("passport");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email|| !password) {
        return res.status(400).send({
          error: "true",
          message: "Username, email atau password belum diisi",
        });
    }

    try {
        await register(username, email, password);
        return res.status(201).send({
            error: false,
            message: "Akun berhasil dibuat"
        })
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email|| !password) {
        return res.status(400).send({
          error: "true",
          message: "Email atau password kosong",
        });
    }

    try {
        const info = await login(email, password);

        return res.status(200).send({
            error: false,
            message: "success",
            loginResult: info
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
})

router.delete("/logout",  verifyToken, async (req, res) => {
    const userId = req.userId;
    if(!userId) return res.status(401);
    return res.sendStatus(200);
})

router.get("/profile/:username", async (req, res) =>{
    const { username } = req.params;
    try {
        const user = await getUserProfile(username);
        return res.status(200).send({
            error: false,
            user: user
            
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
        
    }finally {
        await prisma.$disconnect();
    }
})

router.patch("/profile/edit", verifyToken, async (req, res) => {
    const userId = req.userId;
    if(!userId) return res.status(401);

    const { desc } = req.body;
    
    if(req.files) {
        const { image } = req.files;
        try {
            await updateUserProfileWithImage(userId, image, desc, req, res);
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error.message
            })
        } finally {
            await prisma.$disconnect();
        }
    }
    
    try {
        await updateUserProfileWithoutImage(userId, desc);
        return res.status(200).send({
            error: false,
            message: "Profil berhasil diperbarui" 
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
})

module.exports = router;