const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const verifyToken = require("./middleware/verifyToken");
const routerAnime = require("./controllers/anime-controller");
const routerUser = require("./controllers/user-controller");
// const passport = require('passport');
// const loginGoogle = require("./controllers/auth");

// require("./controllers/auth");

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);

// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// app.get('/', verifyToken, (req, res) => {
//     res.send(`Hello ${req.userId}`);
// });

// app.get('/auth/google', 
//     passport.authenticate("google", {
//         scope: ["profile", "email"]
//     })
// );

// app.get('/auth/google/secrets',
//     passport.authenticate('google', {
//         failureRedirect: "/auth/google"
//     }),
//     loginGoogle
// );

// app.get('/logout', (req, res) => {
//     res.clearCookie('token');
//     req.logout(function (err) {
//         if (err) {
//           return next(err);
//         }
//         req.session.destroy();
//         return res.sendStatus(200);
//       });
// });

app.use("/", routerUser);
app.use("/animes", verifyToken, routerAnime);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
