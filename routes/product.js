const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const { Shoe, Brand, Gender, Color, Size, Material } = require('../models')
const { bootstrapField, createProductForm, createSearchForm } = require('../forms');
const dataLayer = require('../dal/products')
//all of this will route out to render out hbs
//either by using get / post and with an extended url example: /create


router.get('/', async (req, res) => {

    const allBrands = await dataLayer.getBrands();
    const allGenders = await dataLayer.getGenders();
    const allColor = await dataLayer.getColors();
    const allSize = await dataLayer.getSizes();
    const allMaterials = await dataLayer.getAllMaterials();
    let shoes = await dataLayer.fetchWithRelatedShoes();

    allBrands.unshift([0, '--- Any Brand ---']);
    allGenders.unshift([0, '--- Any Gender ---']);
    allColor.unshift([0, '--- Any color ---']);
    allSize.unshift([0, '--- Any size ---']);

    const searchForm = createSearchForm(allBrands, allGenders, allColor, allSize, allMaterials);
    let q = Shoe.collection()

    searchForm.handle(req,{
        'success': async (form) => {
            if (form.data.model) {
                q.where('name', 'like', '%' + form.data.model + '%')
            }
            if (form.data.shoe_type) {
                q.where('shoe_type', 'like', '%' + form.data.shoe_type + '%')
            }
            if (form.data.brand_id && form.data.brand_id !== "0") {
                q.where('brand_id', '=', form.data.brand_id)
            }
            if (form.data.gender_id && form.data.gender_id !== "0") {
                q.where('gender_id', '=', form.data.gender_id)
            }
            if (form.data.color_id && form.data.color_id !== "0") {
                q.where('color_id', '=', form.data.color_id)
            }
            if (form.data.size_id && form.data.size_id !== "0") {
                q.where('size_id', '=', form.data.size_id)
            }
            if (form.data.materials) {
                // ...JOIN products_tags ON products.id = products_tags.product_id
                q.query('join', 'materials_shoes', 'shoes.id', 'shoe_id')
                    .where('material_id', 'in', form.data.materials.split(','))
            }
            
            const products = await q.fetch({
                withRelated: ['brand', 'color', 'size', 'gender', 'materials'] // for each product, load in each of the tag
            });
            res.render('products/index', {
                'shoes': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })

        },
        'empty': async (form) => {
            // let shoes = await q.fetch({
            //     withRelated: ['brand', 'gender', 'materials']
            // })
            res.render('products/index', {
                'shoes': shoes.toJSON(),
                'form': searchForm.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {
    
            res.render('products/index', {
                'shoes': shoes.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
createSearchForm
    })
    // res.render("products/index",
    //     {
    //         'shoes': shoes.toJSON() //to loop and display in a table format on hbs
    //     })//look into product folder and find index
})

//based on the associated url which is https:xxxxx/product/add

//CREATE
router.get('/create', async (req, res) => {

    //here we will get all the data from the tables
    const allBrands = await dataLayer.getBrands();
    const allGenders = await dataLayer.getGenders();
    const allColor = await dataLayer.getColors();
    const allSize = await dataLayer.getSizes();
    const allMaterials = await dataLayer.getAllMaterials();


    // here we will call the caolon form to take the pass-in arguments and store in the
    //widgets,
    //the productForm will consist the the retur form to that variable
    const productForm = createProductForm(allBrands, allGenders, allColor, allSize, allMaterials);

    res.render("products/create", { //based on the folder "products" into create hbs
        'form': productForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESETs
        //here we convert caolon form with the pass in data
        // into html form where the hbs will display them
    })
})

router.post('/create', async (req, res) => {

    const allBrands = await dataLayer.getBrands();
    const allGenders = await dataLayer.getGenders();
    const allColor = await dataLayer.getColors();
    const allSize = await dataLayer.getSizes();
    const allMaterials = await dataLayer.getAllMaterials();

    const productForm = createProductForm(allBrands, allGenders, allColor, allSize, allMaterials);

    productForm.handle(req, {
        success: async (form) => {
            let { materials, ...productData } = form.data;
            const product = new Shoe();
            console.log(materials)
            await product.save(productData);
            if (materials) {
                await product.materials().attach(materials.split(","));
                console.log(materials.split(","))
            }
            req.flash("success_messages", `New Product ${product.get('name')} has been created`)
            res.redirect('/products')
        },
        'empty': async function (form) {
            // executed if the user just submit without any input
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                // "cloudinaryName": process.env.CLOUDINARY_NAME,
                // "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                // "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                // "cloudinaryName": process.env.CLOUDINARY_NAME,
                // "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                // "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })


})

//UPDATE
router.get('/:product_id/update', async (req, res) => {
    const allBrands = await dataLayer.getBrands();
    const allGenders = await dataLayer.getGenders();
    const allColor = await dataLayer.getColors();
    const allSize = await dataLayer.getSizes();
    const allMaterials = await dataLayer.getAllMaterials();

    //fetch shoe by Id
    const shoeById = await dataLayer.getShoeById(req.params.product_id);

    const productForm = createProductForm(allBrands, allGenders, allColor, allSize, allMaterials);

//CHECK HOW BRANDID.VALUE MATCH WITH CAOLAN FORMWIDGETS STORED FOR BRAND ID

      // // fill in the existing values
      productForm.fields.name.value = shoeById.get('name');
      productForm.fields.description.value = shoeById.get('description');
      productForm.fields.shoe_type.value = shoeById.get('shoe_type');
      productForm.fields.brand_id.value = shoeById.get('brand_id');
      productForm.fields.gender_id.value = shoeById.get('gender_id');
      productForm.fields.color_id.value = shoeById.get('color_id');
      productForm.fields.size_id.value = shoeById.get('size_id');
      productForm.fields.image_url.value = shoeById.get('image_url');
      productForm.fields.cost.value = shoeById.get('cost');
      productForm.fields.stock.value = shoeById.get('stock');
      productForm.fields.thumbnail_url.value = shoeById.get('thumbnail_url');
      let selectedMaterials = await shoeById.related('materials').pluck('id');
      productForm.fields.materials.value = selectedMaterials;

    res.render("products/update", { //based on the folder "products" into create hbs
        'form': productForm.toHTML(bootstrapField),
        'shoe': shoeById.toJSON(),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })



})

router.post('/:product_id/update', async (req,res)=>
{
    const allBrands = await dataLayer.getBrands();
    const allGenders = await dataLayer.getGenders();
    const allColor = await dataLayer.getColors();
    const allSize = await dataLayer.getSizes();
    const allMaterials = await dataLayer.getAllMaterials();

    const shoeById = await dataLayer.getShoeById(req.params.product_id);

    const productForm = createProductForm(allBrands, allGenders, allColor, allSize, allMaterials);
    productForm.handle(req, {
        'success': async (form) => {
            let { materials, ...productData } = form.data;
            shoeById.set(productData);
            shoeById.save();
            //update tags
            let materialIds = materials.split(',')
            let existingMaterialIds = await shoeById.related('materials').pluck('id');

            //Remove all the materials that aren't selected anyomre
            let toRemove = existingMaterialIds.filter(id => materialIds.includes(id) === false);
            await shoeById.materials().detach(toRemove);
            await shoeById.materials().attach(materialIds);

            res.redirect('/products');
        }, 'empty': async function (form) {
            // executed if the user just submit without any input
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                // "cloudinaryName": process.env.CLOUDINARY_NAME,
                // "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                // "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                // "cloudinaryName": process.env.CLOUDINARY_NAME,
                // "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                // "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})
//UPDATE


//based on the associated url which is https:xxxxx/product then /delete

//DELETE
router.get('/:product_id/delete', async (req, res) => {
    const shoeById = await dataLayer.getShoeById(req.params.product_id)
    res.render("products/delete",{
        'shoes': shoeById.toJSON()
    })//based on the folder "products" into create hbs
})
router.post('/:product_id/delete', async(req,res)=>
{
    const shoeById = await dataLayer.getShoeById(req.params.product_id)
    
    await shoeById.destroy();
    res.redirect("/products")
})

//DELETE


module.exports = router; // #3 export out the router