const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllAnime = async (req, res) => {
    const userId = req.userId;

    if(!userId) return res.status(401);

    try {
        const animes = await prisma.myAnime.findMany({
            where: {
                userId: userId
            }
        });

        // if(animes.length === 0){
        //     return res.status(404).send({
        //         error: true,
        //         message: "Anime belum ditambahkan"
        //     })
        // }

        return res.status(200).send(animes);
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    }

};

module.exports = getAllAnime;