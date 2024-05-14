// const db = require('../database/database');

// const getAllAnime = async (req, res) => {
//     const userId = req.userId;

//     if(!userId) return res.status(401);

//     try {
//         const animes = await db.query("SELECT * FROM my_animes WHERE user_id = $1", [userId]);
//         const data = animes.rows;

//         if(data.length === 0){
//             return res.status(404).send({
//                 error: true,
//                 message: "Anime belum ditambahkan"
//             })
//         }

//         return res.status(200).send(data);
//     } catch (error) {
//         return res.status(500).send({
//             error: true,
//             message: error.message
//         })
//     }

// };

// module.exports = getAllAnime;