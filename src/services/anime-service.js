const { findExistingAnime, insertAnime, findAllAnime, findJikanAnime, findAnimeById, editAnimeById, removeAnimeById, findAllAnimeReview } = require("../repositories/anime-repository");

const getJikanAnime = async (title) => {
    const anime = await findJikanAnime(title);
    return anime;
}

const addAnime = async (animeData, rating, review, userId) => {
    const anime = animeData.data.data[0];
    const title = anime.title;
    const genres = anime.genres.map((genre) => genre.name).join(", ");
    const episodes = anime.episodes;
    const status = anime.status;
    const year = anime.year;
    const image = anime.images.jpg.image_url;

    const existingAnime = await findExistingAnime(title, userId);
    
    if(existingAnime.length > 0){
        throw Error("Anime sudah ditambahkan, silahkan masukkan anime lain");
    }

    const newAnime = await insertAnime(title, rating, review, genres, episodes, status, year, image, userId);

    return newAnime;
}

const getAllAnime = async (userId) => {
    const animes = await findAllAnime(userId);
    return animes;
}

const getAnimeById = async (animeId, userId) => {
    const anime = await findAnimeById(animeId);

    if(!anime){
        throw Error("Anime tidak ditemukan");
    }
    
    if(userId !== anime.userId){
        throw Error(`Unauthorized`);
    }
    
    return anime;
}

const updateAnimeById = async (animeId, userId, data) => {
    await getAnimeById(animeId, userId);
    await editAnimeById(animeId, data);
}

const deleteAnimeById = async (animeId, userId) => {
    await getAnimeById(animeId, userId);
    await removeAnimeById(animeId);
}

const getAllAnimeReview = async () => {
    const animes = await findAllAnimeReview();
    return animes;
}

module.exports = { getJikanAnime, addAnime, getAllAnime, getAnimeById, updateAnimeById, deleteAnimeById, getAllAnimeReview };