const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { validateReview,isLoggedin,isReviewAuthor } = require("../middleware")


// to save the review in db
router.post("/product/:id/review", validateReview, async (req, res) => {
    try {
        let { id } = req.params;
        let { rating, comment } = req.body;

        const product = await Product.findById(id);
        const review = new Review({ rating, comment,author:req.user._id });

        product.reviews.push(review);
        await review.save();
        await product.save();
        req.flash("success","Review Added Successfully");
        res.redirect(`/product/${id}`);
    }
    catch (err) {
        res.status(500).render('err', { err: err.message })
    }
})

// delete a review
router.delete("/product/:pro_id/review/:rev_id",isLoggedin,isReviewAuthor, async (req, res) => {
    try {
        let { pro_id, rev_id } = req.params;

        await Review.findByIdAndDelete(rev_id);
        let product = await Product.findById(pro_id);
        if (product) {
            product.reviews.pull(rev_id);
            await product.save();
        }
        req.flash("success","Review Deleted Successfully");
        res.redirect(`/product/${pro_id}`)
    }
    catch (err) {
        res.status(500).render('err', { err: err.message })
    }
})












module.exports = router;

