const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware"); 
const app = express();
const port = 3000;
const cors = require("cors");

const dotenv = require('dotenv');
dotenv.config();

app.get("/", (req, res) => {
    res.send(`Hello World!`);
})

// http://localhost:3000/ => http://localhost:3001/ USER
app.use("/user", createProxyMiddleware({
    target: process.env.USER_SERVICE,
    pathRewrite: {
        '^/user': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request: ${req.method} ${req.url} -> ${process.env.USER_SERVICE}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`Received response from ${process.env.USER_SERVICE}: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
        console.error(`Error proxying request: ${err.message}`);
        res.status(500).send('Proxy error');
    }
}));

// http://localhost:3000/animes => http://localhost:3002/ ANIME
app.use("/animes", createProxyMiddleware({
    target: process.env.ANIME_SERVICE,
    pathRewrite: {
        '^/animes': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request: ${req.method} ${req.url} -> ${process.env.ANIME_SERVICE}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`Received response from ${process.env.ANIME_SERVICE}: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
        console.error(`Error proxying request: ${err.message}`);
        res.status(500).send('Proxy error');
    }
}));

app.listen(port, () => {
    console.log(`API Gateway service listening on port ${port}`);
});