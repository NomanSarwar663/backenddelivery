const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const io = require('socket.io')(server);
const mercadopago = require('mercadopago');
mercadopago.configure({
    sandbox: true,
    access_token: null
});

/*
* IMPORTTAR SOCKETS
*/
const ordersSocket = require('./sockets/ordersSocket');

/*
* IMPORTAR RUTAS
*/
const usersRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');


//const port = process.env.PORT || 3000;
const port = process.env.PORT || 3306;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

/*
* LLAMADO A LOS SOCKETS
*/
ordersSocket(io);

const upload = multer({
    storage: multer.memoryStorage()
});

/*
* LLAMADO DE LAS RUTAS
*/
usersRoutes(app, upload);
categoriesRoutes(app ,upload);
addressRoutes(app);
productRoutes(app ,upload);
orderRoutes(app);
mercadoPagoRoutes(app);


//server.listen(3000, '192.168.1.14' || 'localhost', function() {
//'localhost'

/* server.listen(3306, 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
}); */

server.listen(3306, process.env.MYSQL_ADDON_HOST, function() {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
});


// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

app.get('/',  (req, res) => {
    res.send('Ruta raiz del backend');
});


module.exports = {
    app: app,
    server: server
}

// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR