require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const multer = require("multer");
const io = require("socket.io")(server);
const mercadopago = require("mercadopago");
mercadopago.configure({
  sandbox: true,
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const { production } = require("./config/env");

/*
 * IMPORTTAR SOCKETS
 */
const ordersSocket = require("./sockets/ordersSocket");

app.get("/", (req, res) => {
  res.send("Ruta raiz del backend");
});

/*
 * IMPORTAR RUTAS
 */
const usersRoutes = require("./routes/userRoutes");
const categoriesRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const mercadoPagoRoutes = require("./routes/mercadoPagoRoutes");

const port = process.env.PORT || 3306;

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.disable("x-powered-by");

if (!production) {
  app.set("port", port);
}

/*
 * LLAMADO A LOS SOCKETS
 */
ordersSocket(io);

const upload = multer({
  storage: multer.memoryStorage(),
});

/*
 * LLAMADO DE LAS RUTAS
 */
usersRoutes(app, upload);
categoriesRoutes(app, upload);
addressRoutes(app);
productRoutes(app, upload);
orderRoutes(app);
mercadoPagoRoutes(app);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

app.get("/", (req, res) => {
  res.send("Ruta raiz del backend");
});

if (!production) {
  server.listen(port, function () {
    console.log("Aplicacion de NodeJS " + port + " Iniciada...");
  });
}

module.exports = app;

// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR
