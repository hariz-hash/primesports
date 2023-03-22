const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const csrf = require('csurf')
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const cors = require('cors')

// create an instance of express app
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// app.use(cors());
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
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}))

app.use(flash())

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});
// enable CSRF
// app.use(csrf());
// note: replaced app.use(csrf()) with the following:
const csurfInstance = csrf();
app.use(function(req,res,next){
  // console.log("checking for csrf exclusion")
  // exclude whatever url we want from CSRF protection
  if (req.url === "/checkout/process_payment" || req.url.slice(0, 5) == '/api/') {
    return next();
  }
  csurfInstance(req,res,next);
})

app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken();
  next();
})

// Share CSRF with hbs files
app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back');
  } else {
      next()
  }
});

const api ={
  product: require('./routes/api/product'),
  user: require('./routes/api/user'),
  cart: require('./routes/api/cart'),
  checkout: require('./routes/api/checkout')
}

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/product');
const orderRoutes =  require('./routes/order');
const cartRoutes =  require('./routes/cart');
const cloudinaryRoutes = require('./routes/cloudinary.js')
const userRoutes = require('./routes/user')
const checkoutRoutes = require('./routes/checkout')
// const stripeRoutes = require('./routes/stripe')

//to use later
// const cloudinaryRoutes = require('./routes/cloudinary.js')
// const checkoutRoutes = require('./routes/checkout')
// routes, hbs have not setup yet

app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
})
async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use("/orders", orderRoutes);
    app.use("/carts", cartRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/users', userRoutes);
    app.use('/checkout', checkoutRoutes);
    // app.use('/api/product',express.json(), api.product)
    // app.use('/api/user',express.json(), api.user);
    // app.use('/api/cart',express.json(), api.cart);
    // app.use('/api/checkout', api.checkout);

    // app.use('/stripe',stripeRoutes)

    //set up a new url to access productRoutes object
    //via url https:xxxx/products  ---> the rest can
    //be able to view urls in the route objec which is productRoutes
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});