const express = require("express")
const router = express.Router();

const CartServices = require('../services/cart_services');


//  #2 Add a new route to the Express router
router.get('/', (req,res)=>{
    res.render("carts/index")
})

module.exports = router; // #3 export out the router