const logout = async (req, res) => {
    const token = req.cookies.token;
    if(!token) return res.status(204);
    res.clearCookie("token");
    return res.sendStatus(200);
};

module.exports = logout;