const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/products')
const { getUserCart, addToCart, deleteFromCart, setQuantity } = require("../../services/cart_services");
const { checkIfAuthenticatedJWT } = require('../../middlewares')


// module.exports = { getUserCart, addToCart, setQuantity, emptyOfCart, deleteFromCart,checkStock }


//RETRIEVE user items from CARTS;

//RETRIEVE user items from CARTS;


////working
router.get('/', checkIfAuthenticatedJWT, async (req, res) => {

    // extract jwt information
    const user = req.user;
     console.log(user);
    
    console.log(user.id)
    //  res.send(await productDataLayer.getAllProducts())
    const cartItems = await getUserCart(user.id)
    console.log("test")
    res.json(cartItems)
})

//working
router.post('/:shoe_id/add', checkIfAuthenticatedJWT, async (req, res) => {
    // const testAccountId = 12;
    const user = req.user;

    const shoe_id = req.params.shoe_id;
    const quantity = req.body.quantity;

    let add = await addToCart(user.id, shoe_id, quantity);
    // res.send(test)
    if (add) {
        res.json({ "yes": "Success" })
    }
    else {
        res.json({ 'error': "cannot add" })
    }
    // const variant = await productDataLayer.getVariantByIdwithProduct(req.params.product_id)
    // res.send(variant);
})

//working
router.put('/:shoe_id/update', checkIfAuthenticatedJWT, async(req,res)=>{
    const user = req.user;
    const updateQuantity = req.body.newQty;
    const shoe_id = req.params.shoe_id;

    let update = await setQuantity(user.id, shoe_id, updateQuantity);
    if (update) {
        res.json({ "yes": "Success" })
    }
    else {
        res.json({ 'error': "item has reached it's limit" })
    }
  })


//working
router.delete('/:shoe_id/remove', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user;
    const shoe_id = req.params.shoe_id;

    let deleteItemFromCart = await deleteFromCart(user.id, shoe_id)
    
    if (deleteItemFromCart) {
        res.json({ "yes": "Success" })
    }
    else {
        res.json({ 'error': "item has been removed" })
    }
 
})

module.exports = router