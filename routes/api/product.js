const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/products')
const { checkIfAuthenticatedJWT } = require('../../middlewares')


// 1) protect a route with jwt
// - this route cannot be called/won't return any results if the request doesn't have a jwt
// 2) Test the protected route with a valid jwt
// - login first -> get the jwt token
// - make a request with the valid jwt token to the protected route


router.get('/', async (req, res) => {

    // const queryFields = req.query;
    let result = await productDataLayer.fetchWithRelatedShoes();
    res.send(result)
    // res.send(await productDataLayer.getAllProducts())
})
//working

router.post('/search', async (req,res) =>
{
    const queryFields = req.query;
    const searchShoes = await productDataLayer.searchShoes(queryFields)
    res.send(searchShoes)
})// need to test


router.get('/:product_id', async (req, res) => {
    const shoeCall = await productDataLayer.getShoeById(req.params.product_id)
    res.send(shoeCall);
    console.log(shoeCall)
})//working

module.exports = router