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

//other tables ---------------------------------------------------

const Status = bookshelf.model("Status", {
    tableName: "order_statuses",
    orders() {
        return this.hasMany('Order')
    }
})


const Role = bookshelf.model("Role", {
    tableName: "roles",
    user() {
        return this.hasMany('User')
    },
})

const User = bookshelf.model("User", {
    tableName: "users",
    role() {
        return this.belongsTo('Role')
    },
    order() {
        return this.hasMany('Order')

    },
    shoes() {
        return this.belongsToMany('Shoe');//many to many
    },
    cartItems() {
        return this.hasMany('CartItem');
    }

})

const CartItem = bookshelf.model("CartItem",
    {
        tableName: 'cart_items',
        user() {
            return this.belongsTo('User')
        },
        shoe() {
            return this.belongsTo('Shoe','shoe_id')
        }
    })


const Order = bookshelf.model("Order", {
    tableName: "orders",
    user() {
        return this.belongsTo('User')
    },
    status() {
        return this.belongsTo('Status')
    },
    shoes() {
        return this.belongsToMany('Shoe');//many to many
    },
    orderItems() {
        return this.hasMany('OrderItem')

    }
    // relationship with order_items with variants
    //many to many
})

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    shoe() {
        return this.belongsTo('Shoe');
    },
    order() {
        return this.belongsTo('Order');
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens'
})

module.exports = { BlacklistedToken, Shoe, Brand, Gender, Color, Size, Material, User, Order, Role, Status, OrderItem, CartItem };