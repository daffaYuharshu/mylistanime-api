const { PrismaClient } = require("@prisma/client");
const axios = require(`axios`);

const URL = "https://api.jikan.moe/v4/anime";

const prisma = new PrismaClient();

const addAnime = async (req, res) => {
    let { title, rating, review } = req.body;
    const userId = req.userId;
    
    if(!userId) return res.status(401);

    try {
        const result = await axios.get(URL, {
            params: {
                q: title
            }
        });

        

        if(result.data.data.length === 0){
            return res.status(404).send({
                error: true,
                message: "Anime tidak ditemukan"
            })
        }

        const data = result.data.data[0];
        title = data.title;
        const genres = data.genres.map((genre) => genre.name).join(", ");
        const episodes = data.episodes;
        const status = data.status;
        const year = data.year;
        const image = data.images.jpg.image_url;

        const existingAnime = await prisma.myAnime.findMany({
            where: {
                title: title,
                userId: userId
            }
        })

        
        if(existingAnime.length > 0){
            return res.status(400).send({
                error: true,
                message: "Anime sudah ditambahkan, silahkan masukkan anime lain"
            })
        }
        
        const newAnime = await prisma.myAnime.create({
            data: {
                title: title,
                rating: rating,
                review: review,
                genres: genres,
                episodes: episodes,
                status: status,
                year: year,
                image: image,
                userId: userId
            }
        })

        
        
        return res.status(201).send({
            error: false,
            message: "Anime berhasil ditambahkan",
            data: {
                userId  : userId,
                anime: newAnime
            }
        })
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = addAnime;