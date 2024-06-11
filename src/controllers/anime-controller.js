const express = require("express");
const prisma = require("../database/prisma");
const verifyToken = require("../middleware/verifyToken");
const { addAnime, getAllAnime, getJikanAnime, getAnimeById, updateAnimeById, deleteAnimeById, getAllAnimeReview } = require("../services/anime-service");


const router = express.Router();

router.get("/reviews", async (req, res) => {
    try {
        const animes = await getAllAnimeReview();
        return res.status(200).send(animes);
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
});

router.post("/", verifyToken, async (req, res) => {
    let { title, rating, review } = req.body;
    const userId = req.userId;
    if(!userId) return res.status(401);

    try {
        const anime = await getJikanAnime(title);
        const newAnime = await addAnime(anime, rating, review, userId);
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
})

router.get("/", verifyToken, async (req, res) => {
    const userId = req.userId;

    if(!userId) return res.status(401);

    try {
        const animes = await getAllAnime(userId);
        return res.status(200).send(animes);
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
});

router.get("/:id", verifyToken, async (req, res) => {
    const userId = req.userId;
    const animeId = parseInt(req.params.id);
    
    if(!userId) return res.status(401);

    try {
        const anime = await getAnimeById(animeId, userId);
        return res.status(200).send(anime);
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
})

router.patch("/:id", verifyToken, async (req, res) => {
    const userId = req.userId;
    const animeId = parseInt(req.params.id);
    const { rating, review } = req.body;

    if(!userId) return res.status(401);

    try {
        await updateAnimeById(animeId, userId, {rating, review});
        return res.status(200).send({
            error: false,
            message: "Rating/review anime berhasil diubah" 
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

router.delete("/:id", verifyToken, async (req, res) => {
    const userId = req.userId;
    const animeId = parseInt(req.params.id);

    if(!userId) return res.status(401);

    try {
        await deleteAnimeById(animeId, userId);
        return res.status(200).send({
            error: false,
            message: "Anime berhasil dihapus" 
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