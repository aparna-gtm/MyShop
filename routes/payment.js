const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();
const Product = require('../models/Product'); 

// Payment Gateway Config
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_BASE_URL = process.env.NODE_ENV === "production" 
                      ? "https://secure.payu.in/_payment"
                      : "https://test.payu.in/_payment";

// Helper: Generate hash
function generateHash(data) {
    const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
}

// Checkout route (cart or buy now)
router.post('/payumoney', (req, res) => {
    const { amount, productinfo, phone, firstname, email } = req.body;

    const txnid = 'TXN' + Date.now();

    const paymentData = {
        key: PAYU_MERCHANT_KEY,
        txnid,
        amount,
        productinfo,
        firstname: firstname || 'Customer',
        email: email || 'customer@example.com',
        phone: phone || '9999999999',
        surl: `${req.protocol}://${req.get('host')}/payment/success`,
        furl: `${req.protocol}://${req.get('host')}/payment/failure`,
        service_provider: 'payu_paisa'
    };

    paymentData.hash = generateHash(paymentData);

    res.render('payment_form', { paymentData, PAYU_BASE_URL });
});

// Success callback
router.post('/success', (req, res) => {
    req.flash('success', 'Payment Successful!');
    res.redirect('/products');
});

// Failure callback
router.post('/failure', (req, res) => {
    req.flash('error', 'Payment Failed!');
    res.redirect('/cart');
});

// Single product buy now (optional if using separate route)
router.get('/buy/:id', async (req, res) => {
    try {
        const foundProduct = await Product.findById(req.params.id);
        if (!foundProduct) {
            req.flash('error', 'Product not found');
            return res.redirect('/products');
        }

        res.render('checkout_now', {
            user: req.user,
            products: [foundProduct],
            totalAmount: foundProduct.price,
            itemNames: [foundProduct.name]
        });
    } catch (err) {
        console.log(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/products');
    }
});

module.exports = router;
