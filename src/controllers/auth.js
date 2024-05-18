// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth2').Strategy;
// const db = require('../database/database');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   async (accessToken, refreshToken, profile, cb) => {
//     try {
//       const result = await db.query("SELECT * FROM users WHERE email = $1", [
//         profile.email,
//       ]);
//       if (result.rows.length === 0) {
//         const newUser = await db.query(
//           "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
//           [profile.email, "google"]
//         );
//         const userId = newUser.rows[0].id;
//         const userEmail = newUser.rows[0].email;
  
//         return cb(null, {id: userId, email: userEmail});
//       } else {
//         const newUser = await db.query(
//           "SELECT * FROM users WHERE EMAIL = $1",
//           [profile.email]
//         );
//         const userId = newUser.rows[0].id;
//         const userEmail = newUser.rows[0].email;
       
//         return cb(null, {id: userId, email: userEmail});
//       }
//     } catch (err) {
//       return cb(err);
//     }
//   }
// ));

// passport.serializeUser((user, cb) => {
//     cb(null, user);
// });
  
// passport.deserializeUser((user, cb) => {
//     cb(null, user);
// });

// const loginGoogle = (req, res) => {
//   const userId = req.user.id;
//   const userEmail = req.user.email;
//   const token = jwt.sign({ userId, userEmail }, process.env.MY_SECRET, { expiresIn: "1h" });
//   res.cookie("token", token, {
//       httpOnly: true,
//       secure: true
//   });
//   return res.status(200).send({
//       error: false,
//       message: "success",
//       loginResult: {
//           id: userId,
//           email: userEmail,
//           token: token
//       }
//   });
// };

// module.exports = loginGoogle;