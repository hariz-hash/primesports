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
module.exports = {
    getBrands, getGenders, getColors, getSizes, getAllMaterials, fetchAllShoes, getShoeById, fetchWithRelatedShoes
}