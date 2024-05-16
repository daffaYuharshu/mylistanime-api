const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const deleteAnimeById = async (req, res) => {
    const userId = req.userId;
    const animeId = parseInt(req.params.id);

    if(!userId) return res.status(401);

    try {
        const existingAnime = await prisma.myAnime.findUnique({
            where: {
                id: animeId
            }
        })
        

        if(!existingAnime){
            return res.status(404).send({
                error: true,
                message: "Anime tidak ditemukan"
            })
        }

        if(userId !== existingAnime.userId){
            return res.status(401).send({
                error: true,
                message: `Unauthorized`
            });
        }

        await prisma.myAnime.delete({
            where: {
                id: animeId
            }
        })

        return res.status(200).send({
            error: false,
            message: "Anime berhasil dihapus" 
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    }
};

module.exports = deleteAnimeById;