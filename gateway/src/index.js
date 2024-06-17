const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware"); 
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
// http://localhost:3000/ => http://localhost:3001/ USER
app.use("/user", createProxyMiddleware({
    target: `http://localhost:3001`,
    pathRewrite: {
        '^/user': ''
    }
}));

// http://localhost:3000/animes => http://localhost:3002/ ANIME
app.use("/animes", createProxyMiddleware({
    target: `http://localhost:3002`,
    pathRewrite: {
        '^/animes': ''
    }
}));

app.listen(port, () => {
    console.log(`API Gateway service listening on port ${port}`);
});