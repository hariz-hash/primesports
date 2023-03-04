const {CartItem} = require('../models');

// based on the user id, we return all items in the cart
const getCart = async (userId)=>
{
    return await CartItem.collection().where(
        {
            'user_id': userId
        }
    ).fetch({
        require:false,
        withRelated: ['user', 'shoe.color',' shoe.size','shoe.brand']
    })
}

//check if a specific product exists in user's shopping cart
const getCartItemByUserAndShoe = async (userId, shoeId) => {
    return await CartItem.where({
        'user_id': userId,
        'shoe_id': shoeId
    }).fetch({
        require: false
    });
}
// add item to the cart
async  function createCartItem (userId, shoeId, quantity){
    const cartItem = new CartItem({
        'user_id': userId,
        'shoe_id': shoeId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}

// remove item from cart
async function removeFromCart(userId, shoeId) {//base
    let cartItem = await getCartItemByUserAndShoe(userId, shoeId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}
//update quantity based on a specific item in cart
async function updateQuantity(userId, shoeId, newQuantity) {
    let cartItem = await getCartItemByUserAndShoe(userId, shoeId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    }
    return false;
}

module.exports =
{
    getCart,
    createCartItem,
    removeFromCart,
    getCartItemByUserAndShoe,
    updateQuantity
    
}
