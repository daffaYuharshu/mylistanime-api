const express = require('express');
const cors = require('cors');

const routerAnime = require("./controllers/anime-controller");

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3002;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", routerAnime);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
