const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email|| !password) {
        return res.status(400).send({
          error: "true",
          message: "Email atau password kosong",
        });
    }

    try {
        const checkResult = await prisma.user.findUnique({
            where:{
                email: email
            }
        })
        
        if(checkResult){
            return res.status(400).send({
                error: true,
                message: "Email telah terdaftar"
            })
        }else{
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async(err, hash) => {
                if(err){
                    return res.status(500).send({
                        error: true,
                        message: "Error hashing password"
                    })
                }else{
                    await prisma.user.create({
                        data: {
                            email: email,
                            password: hash
                        }
                    })
                    
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
    } finally{
        await prisma.$disconnect();
    }
}

module.exports = register;