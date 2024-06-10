const express = require("express");
const prisma = require("../database/prisma");
const { getAllReview} = require("../services/review-service");


const router = express.Router();


router.get("/review", async (req, res) => {
    

    try {
        const animes = await getAllReview();
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

module.exports = router;