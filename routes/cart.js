const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const { getUserCart, addToCart, deleteFromCart, setQuantity } = require("../services/cart_services");
const { checkIfAuthenticated } = require("../middlewares");

const CartServices = require('../services/cart_services');


//  #2 Add a new route to the Express router
router.get('/', checkIfAuthenticated, async (req, res) => {
    let cart = await getUserCart(req.session.user.id)
    // console.log(cart.toJSON())
    res.render("carts/index",
        {
            'cart': cart.toJSON()
        }
    )
})

//CREATE
router.get('/:shoe_id/add', checkIfAuthenticated, async function (req, res) {
    const userId = req.session.user.id;
    const shoe_id = req.params.shoe_id;
    const quantity = req.body.quantity;

    // console.log(" Sho id " + shoe_id)
    // console.log(" User id " + userId)

    await addToCart(userId, shoe_id, 1);
    req.flash("success_messages", "The item has been added");
    res.redirect('/carts')
})

router.get('/:shoe_id/remove', checkIfAuthenticated, async (req,res)=> {
    const userId = req.session.user.id;
    const shoe_id = req.params.shoe_id;

    await deleteFromCart(userId, shoe_id)

    req.flash("success_messages", 'Item has been removed');
    res.redirect('/carts');
})

router.post('/:shoe_id/update', checkIfAuthenticated, async(req,res)=>{
    const userId = req.session.user.id;
    const updateQuantity = req.body.newQty;
    const shoe_id = req.params.shoe_id;

    await setQuantity(userId, shoe_id, updateQuantity);
    req.flash('success_messages', "The quantity has been updated");
    res.redirect('/carts');
  })



module.exports = router; // #3 export out the router