const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const { Sport, Brand, Gender, Color, Size, Material } = require('../models')
const { bootstrapField, createProductForm } = require('../forms');
//all of this will route out to render out hbs
//either by using get / post and with an extended url example: /create
router.get('/', async (req, res) => {
    //fetch all products = SELECT * FROM PRODUCTS
    let shoes = await Sports.collection().fetch()
    res.render("products/index",
        {
            'shoes': shoes.toJSON()
        })//look into product folder and find index
})

//based on the associated url which is https:xxxxx/product/add
router.get('/create', async (req, res) => {
    const brands = await Brand.fetchAll().map((each) => {
        return [each.get('id'), each.get('brand')]
    })
    const genders = await Gender.fetchAll().map((each) => {
        return [each.get('id'), each.get('gender')]

    })
    const color = await Color.fetchAll().map((each) => {
        return [each.get('id'), each.get('color')]
    })
    const size = await Size.fetchAll().map((each) => {
        return [each.get('id'), each.get('size')]
    })
    const materials = await Material.fetchAll().map((each) => {
        return [each.get('id'), each.get('materials')]

    })
    const productForm = createProductForm(brands, genders, color, size, materials);

    res.render("products/create",{
        'form': productForm.toHTML(bootstrapField),

    })//based on the folder "products" into create hbs
})
//based on the associated url which is https:xxxxx/product then /delete

router.get('/delete', (req, res) => {
    res.render("products/delete")//based on the folder "products" into create hbs
})
router.get('/update', (req, res) => {
    res.render("products/update")//based on the folder "products" into create hbs
})
module.exports = router; // #3 export out the router