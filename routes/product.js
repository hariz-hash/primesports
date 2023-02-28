const express = require("express");
const router = express.Router();
//all of this will route out to render out hbs
//either by using get / post and with an extended url example: /create
router.get('/', (req,res)=>
{
    res.render("products/index")//look into product folder and find index
})

//based on the associated url which is https:xxxxx/product/add
router.get('/add', (req,res)=>
{
    res.render("products/create")//based on the folder "products" into create hbs
})
//based on the associated url which is https:xxxxx/product then /delete

router.get('/delete', (req,res)=>
{
    res.render("products/delete")//based on the folder "products" into create hbs
})
router.get('/update', (req,res)=>
{
    res.render("products/update")//based on the folder "products" into create hbs
})
module.exports = router; // #3 export out the router