
const express = require('express');
const router = express.Router();
const { isLoggedin } = require('../middleware');
const User = require('../models/User');
const Product = require('../models/Product');

// GET Wishlist page
router.get('/wishlist', isLoggedin, async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.render('wishlist/wishlist', { user });
});

// POST: Add product to wishlist
router.post('/user/:productId/wishlist', isLoggedin, async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

   res.redirect('/wishlist');
});

// POST: Remove product from wishlist
router.post('/user/:productId/remove-wishlist', isLoggedin, async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();

  res.redirect('/wishlist');
});

module.exports = router;
