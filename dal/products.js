const async = require('hbs/lib/async');
const { Shoe, Brand, Gender, Color, Size, Material } = require('../models');


const getBrands = async () => {
    return await Brand.fetchAll().map((each) => {
        return [each.get('id'), each.get('brand')]
    })
}

const getGenders = async () => {
    return await Gender.fetchAll().map((each) => {
        return [each.get('id'), each.get('gender')]
    })
}
const getColors = async () => {
    return await Color.fetchAll().map((each) => {
        return [each.get('id'), each.get('color')]
    })
}

const getSizes = async () => {
    return await Size.fetchAll().map((each) => {
        return [each.get('id'), each.get('size')]
    })
}
const getAllMaterials = async () => {
    return await Material.fetchAll().map((each) => {
        return [each.get('id'), each.get('materials')]

    })
}

const fetchAllShoes = async () => {
    return await Shoe.collection().fetch()
}

const fetchWithRelatedShoes = async () => {
    return await Shoe.collection().fetch(
        {
            withRelated: ['brand', 'color', 'size', 'gender', 'materials']

        }
    )

}

const getShoeById = async (shoeId) => {
    return await Shoe.where({
        'id': shoeId
    }).fetch({
        require: true,
        withRelated: ['brand', 'gender', 'color', 'size', 'materials']
    })
}

async function updateShoe(shoeId, data) {
    const shoe = await getShoeById(shoeId);
    if (!shoe) {
        return;
    }
    shoe.set(data);
    await shoe.save();
    return true
};


//
const searchShoes = async (search) => {
    let query = Shoe.collection()
    console.log(search)
    if (search.name) {
        // MySQL syntax (case insensitive by default)
        if (process.env.DB_DRIVER == 'mysql') {
            query.where('name', 'like', `%${search.name}%`);
        } else {
            query.where('name', 'ilike', `%${search.name}%`);
        }
    }

    if (search.shoeType) {
        // MySQL syntax (case insensitive by default)
        if (process.env.DB_DRIVER == 'mysql') {
            query.where('shoe_type', 'like', `%${search.shoeType}%`);
        } else {
            query.where('shoe_type', 'ilike', `%${search.shoeType}%`);
        }
    }
    if (search.brand_id && search.brand_id != 0) {
        query.where('brand_id', '=', search.brand_id);
    }

    if (search.gender_id && search.gender_id != 0) {
        query.where('gender_id', '=', search.gender_id);
    }

    if (search.color_id && search.color_id != 0) {
        query.where('color_id', '=', search.color_id);
    }

    if (search.size_id && search.size_id != 0) {
        query.where('size_id', '=', search.size_id);
    }

    if (search.materials && search.materials != 0) {
        // ...JOIN products_tags ON products.id = products_tags.product_id
        query.query('join', 'materials_shoes', 'shoes.id', 'shoe_id')
            .where('material_id', 'in', search.materials.split(','))
    }
    if (search.min_cost) {
        query.where('cost', '>=', search.min_cost)
    }
    
    if(search.max_cost){
        query.where('cost', '<=', search.max_cost)
    }
    const searchShoes = (await query.fetch({
        withRelated: ['gender', 'brand', 'materials', 'color', 'size'] // for each product, load in each of the tag
    })).toJSON();
    // const searchShoes = (await query.fetch({withRelated:['gender', 'brand', 'materials']})).toJSON();
    return searchShoes;
}



module.exports = {
    getBrands, getGenders, getColors, getSizes, getAllMaterials, fetchAllShoes, getShoeById, fetchWithRelatedShoes, updateShoe, searchShoes
}