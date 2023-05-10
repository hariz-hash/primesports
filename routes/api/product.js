const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/products')
const { checkIfAuthenticatedJWT } = require('../../middlewares')


// 1) protect a route with jwt
// - this route cannot be called/won't return any results if the request doesn't have a jwt
// 2) Test the protected route with a valid jwt
// - login first -> get the jwt token
// - make a request with the valid jwt token to the protected route

//working
router.get('/', async (req, res) => {

    // const queryFields = req.query;
    let result = await productDataLayer.fetchWithRelatedShoes();
    res.send(result)
    // res.send(await productDataLayer.getAllProducts())
})


//Working
router.get('/search', async (req,res) =>
{
    const queryFields = req.query;
    const searchShoes = await productDataLayer.searchShoes(queryFields)
    res.send({searchShoes})
})// need to test

//working
router.get('/:product_id', async (req, res) => {
    const shoeCall = await productDataLayer.getShoeById(req.params.product_id)
    res.send(shoeCall);
    console.log(shoeCall)
})//working


router.get('/options', async(req,res) =>
{
    const allBrands = await productDataLayer.getBrands()
    allBrands.unshift([0, '--- Any Brand ---']);

    const allColors = await productDataLayer.getColors();
    allColors.unshift([0, '--- Any Colors ---']);

    const allSize = await productDataLayer.getSizes()
    allSize.unshift([0, '--- Any sizes ---']);

    // const allMaterials = await productDataLayer.getAllMaterials()
    // allMaterials.unshift([0, '--- Any materials ---']);

    // const allGenders = await productDataLayer.getGenders()
    console.log("in here")
    const options =
    {
        allBrands,
        allColors,
        allSize,
        // allMaterials,
        // allGenders
    }
    res.json(options)

})
module.exports = router