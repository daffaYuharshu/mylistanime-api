const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware"); 
const app = express();
const port = 3000;
const cors = require("cors");

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
// http://localhost:3000/ => http://localhost:3001/ USER
app.use("/user", createProxyMiddleware({
    target: process.env.USER_SERVICE,
    pathRewrite: {
        '^/user': ''
    }
}));

// http://localhost:3000/animes => http://localhost:3002/ ANIME
app.use("/animes", createProxyMiddleware({
    target: process.env.ANIME_SERVICE,
    pathRewrite: {
        '^/animes': ''
    }
}));

app.listen(port, () => {
    console.log(`API Gateway service listening on port ${port}`);
});