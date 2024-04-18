const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const register = require('./controllers/register');
const login = require('./controllers/login');
const logout = require('./controllers/logout');
const verifyToken = require('./middleware/verifyToken');
const passport = require('passport');
require("./controllers/auth");
const dotenv = require('dotenv');
const isLoggedIn = require('./middleware/isLoggedIn');
dotenv.config();

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

app.get('/', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.email}!`);
});

app.get('/failure', (req, res) => {
    res.send('Gagal login');
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
        successRedirect: "/",
        failureRedirect: "/failure"
    })
);
app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        req.session.destroy();
        res.send(`Logout berhasil`); 
      });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});