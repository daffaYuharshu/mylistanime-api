const axios = require(`axios`);
const db = require('../database/database');

const URL = "https://api.jikan.moe/v4/anime";

const addAnime = async (req, res) => {
    try {
        let { title, rating, review } = req.body;
        const userId = req.userId;
    
        if(!userId) return res.status(401);

        const result = await axios.get(URL, {
            params: {
                q: title
            }
        });
        const data = result.data.data[0];
        title = data.title;
        const genres = data.genres.map((genre) => genre.name).join(", ");
        const episodes = data.episodes;
        const status = data.status;
        const year = data.year;
        const image = data.images.jpg.image_url;

        const checkDuplicate = await db.query("SELECT * FROM my_animes WHERE title = $1 AND user_id = $2", [title, userId]);

        if(checkDuplicate.rows.length > 0){
            return res.status(400).send({
                error: true,
                message: "Anime sudah ditambahkan, silahkan masukkan anime lain"
            })
        }
        

        await db.query(
            "INSERT INTO my_animes (title, rating, review, genres, episodes, status, year, image, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [title, rating, review, genres, episodes, status, year, image, userId]
        );
        
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
    }
};

module.exports = addAnime;