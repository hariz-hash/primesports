const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const productDataLayer = require('../../dal/products')
const { checkIfAuthenticatedJWT } = require('../../middlewares')


router.get('/', async (req, res) => {
    let result = await productDataLayer.fetchWithRelatedShoes();
    res.send(result)
})

router.get('/:shoe_id', async (req, res) => {
    const shoeDetailsId = await productDataLayer.getShoeById(req.params.shoe_id);
    res.send(shoeDetailsId)

})

router.get('/search_options', async (req, res) => {
    const brands = await productDataLayer.getBrands();
    brands.unshift([0, '---Any brands'])

    const genders = await productDataLayer.getGenders();
    genders.unshift([0, '---Any genders---'])

    const colors = await productDataLayer.getColors();
    colors.unshift([0, '---Any colours---'])

    const sizes = await productDataLayer.getSizes();
    sizes.unshift([0, '---Any colours---'])

    const options = {
        brands,
        genders,
        colors,
        sizes
    }
    res.send(options)

})

router.get('/search', async(req,res)=>
{
    // let q = Shoe.collection();
    // console.log(q)
    const queryFields = req.query;
    const searchShoe = await productDataLayer.searchShoes(queryFields);
    res.send({searchShoe});
})


module.exports = router
