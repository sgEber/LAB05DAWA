const express = require('express');
const jwt = require("jsonwebtoken");
const config = require('./public/scripts/config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('/user', (req, res, next) => {
    console.log('Por aqui pasamos');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/sinup', (req, res) => {
    console.log(`Post pagina de login ${req.body.username}`);
    console.log(`Post pagina de login ${req.body.password}`);
    
    if (`${req.body.username}` === 'Jose Perez' && `${req.body.password}` === '29') {
        console.log('Nombre: ' + `${req.body.username}` + ', Password: ' + `${req.body.password}`);
        const user = {
            nombre: `${req.body.username}`,
            password: `${req.body.password}`
        }
        jwt.sign({ user: user }, 'secretkey', { expiresIn: '32s' }, (err, token) => {
            console.log("Token:", token);
            res.json({ token: token });
        });
    }
    else {
        return res.status(401).json({
            auth: false,
            message: 'No se proporcionó un token'
        });
    }
});

app.post('/sinin', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: "El post fue creado",
                authData: authData
            });
        }
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.status(401);
    }
}

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000, http://localhost:3000/')
});