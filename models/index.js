const bookshelf = require('../bookshelf')

const Sport = bookshelf.model('Sports',
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
        return this.belongsToMany('Material', "materials_shoes", "shoe_id");
    }
})

const Brand = bookshelf.model('Brand', {
    tableName: "brands",
    sports() {
        return this.hasMany('Sports')
    }
});

const Gender = bookshelf.model("Gender", {
    tableName: "genders",
    sports() {
        return this.hasMany('Sports')
    }
})

const Color = bookshelf.model("Color", {
    tableName: "colors",
    sports() {
        return this.hasMany('Sports')
    }
})

const Size = bookshelf.model("Size", {
    tableName: "sizes",
    sports() {
        return this.hasMany('Sports')
    }

})

const Material = bookshelf.model('Material', {
    tableName: 'materials',
    sports() {
        return this.belongsToMany('Sports');
    }
});

module.exports = { Sport, Brand, Gender, Color, Size, Material };