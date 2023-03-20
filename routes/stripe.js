// const express = require('express');
// const router = express.Router();
// const orderLayer = require('../dal/order')
// const productLayer = require('../dal/products')
// const cartServices = require('../services/cart_services');
// const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



// router.post('/process_payment', express.raw({ type: 'application/json' }), async function (req, res) {
//     // verify that the request is actually sent from the stripe
//     const payload = req.body;
//     console.log(payload)
//     console.log("inside  process payment")

//     // the stripe-signature will be a hash of the data that stripe is sending you
//     const signature = req.headers["stripe-signature"];

//     // endpoint secret
//     const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

//     let event = null;
//     try {
//         event = Stripe.webhooks.constructEvent(payload, signature, endpointSecret);
//     } catch (e) {
//         res.status(500);
//         res.send({
//             'error': e.message
//         })
//     }
//     // there is no error
//     if (event.type == 'checkout.session.completed') {

//         let stripeSession = event.data.object;
//         const metadata = JSON.parse(event.data.object.metadata.orders);
//         const userId = metadata[0].user_id;
//         const paymentDetails = await Stripe.paymentIntents.retrieve(stripeSession.payment_intent)
//         const paymentMethod = paymentDetails.payment_method_types;

//         const receipt = await Stripe.invoices.retrieve(
//             stripeSession.invoice
//         )

//         const dateTime = paymentDetails.created;
//         const covertDate = dateTime * 1000;
//         const covertToTodayDate = new Date(dateTime * 1000);
//         const deliverDateOneWeek = new Date(covertDate + 7 * 24 * 60 * 60 * 1000)

//         const receiptURL = receipt.hosted_invoice_url;
//         const orderData = {
//             total_amount: stripeSession.amount_total,
//             payment_type: paymentMethod,
//             receipt_url: receiptURL,
//             shipping_address_line1: paymentDetails.shipping.address.line1,
//             shipping_address_line2: paymentDetails.shipping.address.line2,
//             shipping_postal_code: paymentDetails.shipping.address.postal_code,
//             shipping_country: paymentDetails.shipping.address.country,
//             order_date: covertToTodayDate,
//             delivery_date: deliverDateOneWeek,
//             user_id: userId,
//             order_status_id: 3,
//         }
//         // console.log("THIS IS FROM ORDER DATA", orderData);
//         const makeOrder = await orderLayer.addOrder(orderData);
//         // console.log(makeOrder.toJSON())
//         const orderId = makeOrder.get('id');

//         // console.log("IN META DATA", metadata)
//         for (let lineItem of metadata) {
//             const shoeId = lineItem.shoe_id;
//             const quantity = lineItem.quantity;

//             const orderItemData = {
//                 order_id: orderId,
//                 shoe_id: shoeId,
//                 quantity: quantity,
//             }
//             await orderLayer.addOrderItem(orderItemData);
//             const stock = await cartServices.checkStock(shoeId);
//             // await productLayer.u
//             const updatedStock = stock - quantity;
//             await productLayer.updateShoe(shoeId, updatedStock);

//         }

//         await cartServices.emptyOfCart(userId);

//     }
//     res.sendStatus(200);
// })
// router.get('/success', function (req, res) {
//     res.render('checkouts/success')
// })

// router.get('/cancelled', function (req, res) {
//     res.render("checkouts/cancelled")
// })

// module.exports = router;