const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/product');
const orderRoutes =  require('./routes/order');
const cartRoutes =  require('./routes/cart');

//to use later
// const cloudinaryRoutes = require('./routes/cloudinary.js')
// const userRoutes = require('./routes/users')
// const checkoutRoutes = require('./routes/checkout')
// routes, hbs have not setup yet
async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use("/orders", orderRoutes);
    app.use("/carts", cartRoutes);

    //set up a new url to access productRoutes object
    //via url https:xxxx/products  ---> the rest can
    //be able to view urls in the route objec which is productRoutes
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});