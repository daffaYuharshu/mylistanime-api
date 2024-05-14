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

        // const checkDuplicate = await db.query("SELECT * FROM my_animes WHERE title = $1 AND user_id = $2", [title, userId]);
        // const checkDuplicate2 = await prisma.myanime.findUnique({
        //     where: {
        //         title: title,
        //         user_id: userId
        //     }
        // })

        // console.log(checkDuplicate)
        // console.log(checkDuplicate2)
        // if(checkDuplicate.rows.length > 0){
        //     return res.status(400).send({
        //         error: true,
        //         message: "Anime sudah ditambahkan, silahkan masukkan anime lain"
        //     })
        // }
        

        // await db.query(
        //     "INSERT INTO my_animes (title, rating, review, genres, episodes, status, year, image, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [title, rating, review, genres, episodes, status, year, image, userId]
        // );

        
        await prisma.myAnime.create({
            data: {
                title: title,
                rating: rating,
                review: review,
                genres: genres,
                episodes: episodes,
                status: status,
                year: year,
                image: image,
                user_id: userId
            }
        })

        
        
        return res.status(201).send({
            error: false,
            message: "Anime berhasil ditambahkan",
            data: {
                user_id : userId,
                anime: title
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