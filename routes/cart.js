const express = require('express');
const router = express.Router(); 
const {isLoggedin}=require('../middleware')
const Product = require('../models/Product')
const User = require('../models/User')

// route to seee the cart
router.get('/cart/cart', isLoggedin, async (req, res) => {
    let user = await User.findById(req.user._id).populate('cart');
    res.render('cart/cart', { user });
});


// add the product to cart actually
router.post('/user/:productId/add',isLoggedin,async(req,res)=>{
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user.cart.includes(productId)) {
        user.cart.push(productId);
        await user.save();
    }

    res.redirect('/cart/cart');

})



// remove from cart
router.post('/user/:productId/remove', isLoggedin, async (req, res) => {
    let { productId } = req.params;
    let userId = req.user._id;

     await User.findByIdAndUpdate(userId, {
        $pull: { cart: productId } 
    });

    res.redirect('/cart/cart');
});






module.exports = router;