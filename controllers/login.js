const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient();

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email|| !password) {
        return res.status(400).send({
          error: "true",
          message: "Email atau password kosong",
        });
    }

    try {
        const checkResult = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(!checkResult){
            return res.status(400).send({
                error: true,
                message: "Email atau password salah"
            })
        }else{
            const userPassword = checkResult.password;
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

            const userId = checkResult.id;
            const userEmail = checkResult.email;
            
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
    } finally {
        await prisma.$disconnect();
    }
    
};

module.exports = login;