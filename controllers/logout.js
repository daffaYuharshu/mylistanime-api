const logout = async (req, res) => {
    const token = req.cookies.token;
    if(!token) return res.status(204);
    res.clearCookie("token");
    req.session.destroy();
    return res.sendStatus(200);
    // req.logout(function (err) {
    //     if (err) {
    //       return next(err);
    //     }
    //     req.session.destroy();
    //     return res.sendStatus(200);
    //   });
};

module.exports = logout;