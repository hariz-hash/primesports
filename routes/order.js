const express = require("express");
const router = express.Router();

//based on the associated url which is https:xxxxx/orders/ from index.js
router.get('/', (req,res)=>
{
    res.render('orders/index')
})
//based on the associated url which is https:xxxxx/orders from index.js main then /update
router.get('/update', (req,res)=>
{
    res.render('orders/update')
})


module.exports = router; // #3 export out the router