const express = require("express");
const router = express.Router();
const { checkIfAuthenticated } = require('../middlewares');
const dataLayer = require('../dal/order')
const { searchOrderForm, updateStatusForm, bootstrapField } = require('../forms');
const { Order } = require('../models')


//based on the associated url which is https:xxxxx/orders/ from index.js
router.get('/',checkIfAuthenticated, async(req,res)=>
{
    const orders = await dataLayer.retrieveAllOrders()
    const status = await dataLayer.retrieveStatus()
    const showOrderForm = searchOrderForm(status)

    let q = Order.collection()
    showOrderForm.handle(req, {
        'success': async function (form) {
            if (form.data.min_cost) {
                console.log(form.data.min_cost)
                q.where('total_amount', '>=', form.data.min_cost)
            }
            if (form.data.max_cost) {
                console.log(form.data.max_cost)

                q.where('total_amount', '<=', form.data.max_cost)
            }
            if (form.data.shipping_postal_code) {
                console.log(form.data.shipping_postal_code)

                q.where('shipping_postal_code', '=', form.data.shipping_postal_code)
            }
            if (form.data.order_status_id) {
                console.log(form.data.order_status_id)
                q.where('order_status_id', '=', form.data.order_status_id)
            }

            const orders = await q.fetch({
                withRelated:['status', 'user'] // for each product, load in each of the tag
            });

            res.render('orders/index',
                {
                    orders: orders.toJSON(),
                    'form': showOrderForm.toHTML(bootstrapField)
                })
        },
        'empty': async function (form) {

            res.render('orders/index',
                {
                    orders: orders.toJSON(),
                    form: showOrderForm.toHTML(bootstrapField)
                })
        },
        'error': async function (form) {
            res.render('orders/index',
                {
                    orders: orders.toJSON(),
                    form: showOrderForm.toHTML(bootstrapField)
                })
        }
    })
    // res.render('orders/index')
})
//based on the associated url which is https:xxxxx/orders from index.js main then /update
router.get('/update/:order_id', checkIfAuthenticated, async (req, res) => {//update/17
    const orders = await dataLayer.retrieveOrderById(req.params.order_id)
    const status = await dataLayer.retrieveStatus()

    const createUpdateForm = updateStatusForm(status)
    createUpdateForm.fields.order_status_id.value = orders.get('order_status_id');
    res.render('orders/update',
        {
            form: createUpdateForm.toHTML(bootstrapField)
        })
});

router.post('/update/:order_id', checkIfAuthenticated, async (req, res) => {
    const orderID = req.params.order_id;
    const order = await dataLayer.retrieveOrderById(orderID);
    const status = await dataLayer.retrieveStatus()
    const createUpdateForm = updateStatusForm(status)

    createUpdateForm.handle(req, {
        success: async function (form) {
            const { ...orderData } = form.data;
            order.set(orderData);
            await order.save()
            // await dataLayer.updateOrder(orderData)
            req.flash('success_messages', 'order updated')
            res.redirect('/orders/')
        },
        error: async function (form) {
            res.render('orders/update',
                {
                    form: form.toHTML(bootstrapField)
                })
        },
        empty: async function (form) {
            res.render('orders/update',
                {
                    form: form.toHTML(bootstrapField)
                })
        }

    })

    // const orders = await dataLayer.retrieveAllOrders(req.params.order_id)
    // const status = await dataLayer.retrieveStatus()

    // const updateOrderForm = updateStatusForm({status})
    // updateOrderForm.fields.order_status_id.value = orders.get('order_status_id');
    // res.render('order/update',
    // {
    //     form: updateOrderForm.toHTML(bootstrapField)
    // })
});



module.exports = router; // #3 export out the router