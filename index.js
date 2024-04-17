const express = require('express');
const cookieParser = require('cookie-parser');
const register = require('./controllers/register');
const login = require('./controllers/login');
const logout = require('./controllers/logout');
const verifyToken = require('./middleware/verifyToken');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/register', register);
app.post('/login', login);
app.delete('/logout', verifyToken, logout);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});