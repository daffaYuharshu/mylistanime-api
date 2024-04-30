const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const register = require('./controllers/register');
const login = require('./controllers/login');
const logout = require('./controllers/logout');
const verifyToken = require('./middleware/verifyToken');
const loginGoogle = require("./controllers/auth");

require("./controllers/auth");
const dotenv = require('dotenv');
const addAnime = require('./controllers/addAnime');
const getAllAnime = require('./controllers/getAllAnime');
const getAnimeById = require('./controllers/getAnimeById');
const updateAnimeById = require('./controllers/updateAnimeById');
const deleteAnimeById = require('./controllers/deleteAnimeById');

dotenv.config();
// test git
const app = express();
const port = 3000;

app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', verifyToken, (req, res) => {
    res.send(`Hello ${req.userId}`);
});

app.post('/register', register);
app.post('/login', login);
app.delete('/logout', verifyToken, logout);
app.get('/auth/google', 
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);
app.get('/auth/google/secrets',
    passport.authenticate('google', {
        failureRedirect: "/auth/google"
    }),
    loginGoogle
);

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        req.session.destroy();
        return res.sendStatus(200);
      });
});


app.post('/animes', verifyToken, addAnime);
app.get('/animes', verifyToken, getAllAnime);
app.get('/animes/:id', verifyToken, getAnimeById);
app.patch('/animes/:id', verifyToken, updateAnimeById);
app.delete('/animes/:id', verifyToken, deleteAnimeById);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});