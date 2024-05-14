// const db = require('../database/database');

// const deleteAnimeById = async (req, res) => {
//     const userId = req.userId;
//     const animeId = req.params.id;

//     if(!userId) return res.status(401);

//     try {
//         const existingAnime = await db.query("SELECT * FROM my_animes WHERE id = $1", [animeId]);

//         if(existingAnime.rows.length === 0){
//             return res.status(404).send({
//                 error: true,
//                 message: "Anime tidak ditemukan"
//             })
//         }

//         const data = existingAnime.rows[0];
        
//         if(userId !== data.user_id){
//             return res.status(401).send({
//                 error: true,
//                 message: `Unauthorized`
//             });
//         }

//         await db.query("DELETE FROM my_animes WHERE id = $1", [animeId]);

//         return res.status(200).send({
//             error: false,
//             message: "Anime berhasil dihapus" 
//         });
//     } catch (error) {
//         return res.status(500).send({
//             error: true,
//             message: error.message
//         })
//     }
// };

// module.exports = deleteAnimeById;