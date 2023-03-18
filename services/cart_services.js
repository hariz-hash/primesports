const cartDataLayer = require('../dal/cart_items')
const productDataLayer = require('../dal/products');

async function getUserCart(userId) {
    // console.log("In the cart services " + userId)
    return await cartDataLayer.getCart(userId);
}

async function checkStock(shoeId) {
    const shoes = await productDataLayer.getShoeById(shoeId);
    return parseInt(shoes.get('stock')); //get column
}

//add this
async function addToCart(userId, shoeId, quantity) {
    const cartItem = await cartDataLayer.getCartItemByUserAndShoe(userId, shoeId);
    const stock = await checkStock(shoeId);
    // console.log(variantId + " id")
    if (cartItem) {
        return await cartDataLayer.updateQuantity(userId, shoeId, quantity, cartItem.get('quantity') + 1);
    }
    else {
        let newCart = cartDataLayer.createCartItem(userId, shoeId, quantity);
        return newCart;
    }
}

//UPDATE CART
async function setQuantity(userId, shoeId, quantity) {
    const stock = await checkStock(shoeId)

    if(quantity > stock)
    {
        return false;
    }

    return await cartDataLayer
               .updateQuantity(userId, shoeId, quantity);
}


//delete

async function deleteFromCart(userId, shoeId)
{
    return await cartDataLayer.removeFromCart(userId, shoeId)
}

async function emptyOfCart(userId)
{
    const cartList = await cartDataLayer.getCart(userId)
    for( let i of cartList)
    {
        const shoeId = i.get('shoe_id');
        await deleteFromCart(userId,shoeId)
    }
}

module.exports = { getUserCart, addToCart, setQuantity, emptyOfCart, deleteFromCart }