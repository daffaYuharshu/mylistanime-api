const prisma = require("../database/prisma");

const findAllReview = async () => {
    const animes = await prisma.myAnime.findMany()
    return animes;
}

module.exports = { findAllReview };
