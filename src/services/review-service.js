const { findAllReview } = require("../repositories/review-repository");

const getAllReview = async () => {
    const animes = await findAllReview();
    return animes;
}
module.exports = { getAllReview };