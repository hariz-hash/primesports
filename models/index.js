const bookshelf = require('../bookshelf')

const Shoe = bookshelf.model('Shoe',
{
    tableName:'shoes',
    brand() {
        return this.belongsTo('Brand')
    },
    gender() {
        return this.belongsTo('Gender')
    },
    color() {
        return this.belongsTo('Color')
    },
    size() {
        return this.belongsTo('Size')
    },
    materials() {
        return this.belongsToMany("Material", "materials_shoes", "shoe_id")
    }
})

const Brand = bookshelf.model('Brand', {
    tableName: "brands",
    shoes() {
        return this.hasMany('Shoe')
    }
});

const Gender = bookshelf.model("Gender", {
    tableName: "genders",
    shoes() {
        return this.hasMany('Shoe')
    }
})

const Color = bookshelf.model("Color", {
    tableName: "colors",
    shoes() {
        return this.hasMany('Shoe')
    }
})

const Size = bookshelf.model("Size", {
    tableName: "sizes",
    shoes() {
        return this.hasMany('Shoe')
    }

})

const Material = bookshelf.model('Material', {
    tableName: 'materials',
    shoes() {
        return this.belongsToMany('Shoe', 'materials_shoes', 'material_id');
    }
});

module.exports = { Shoe, Brand, Gender, Color, Size, Material };