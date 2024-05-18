const prisma = require("../database/prisma");
const URL = "https://api.jikan.moe/v4/anime";
const axios = require("axios");

const findJikanAnime = async (title) => {
    const anime = await axios.get(URL, {
        params: {
            q: title
        }
    })

    if(anime.data.data.length === 0){
        throw Error("Anime tidak ditemukan")
    }

    return anime;
}

const findExistingAnime = async (title, userId) => {
    const anime = await prisma.myAnime.findMany({
        where: {
            title: title,
            userId: userId
        }
    })

    return anime;
}

const insertAnime = async (title, rating, review, genres, episodes, status, year, image, userId) => {
    const anime = await prisma.myAnime.create({
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

    return anime;
}

const findAllAnime = async (userId) => {
    const animes = await prisma.myAnime.findMany({
        where: {
            userId: userId
        }
    });
    return animes;
}

const findAnimeById = async (animeId) => {
    const anime = await prisma.myAnime.findUnique({
        where: {
            id: animeId
        }
    })
    return anime;
}

const editAnimeById = async (animeId, data) => {
    await prisma.myAnime.update({
        where: {
            id: animeId
        },
        data: {
            rating: data.rating,
            review: data.review
        }
    })
}

const removeAnimeById = async (animeId) => {
    await prisma.myAnime.delete({
        where: {
            id: animeId
        }
    })
}

module.exports = { findJikanAnime, findExistingAnime, insertAnime, findAllAnime, findAnimeById, editAnimeById, removeAnimeById };