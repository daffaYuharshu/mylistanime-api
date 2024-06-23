const express = require('express');
const cors = require('cors');
const FileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const os = require('os');

const routerUser = require("./controllers/user-controller");

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(FileUpload());
app.use(express.static("public"));


const imagesDir = path.resolve(__dirname, "public", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

app.use("/", routerUser);
// app.use('/images', express.static(os.tmpdir()));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});