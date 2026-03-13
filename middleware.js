const Product = require("./models/Product");
const Review = require("./models/Review");
const { productSchema, reviewSchema } = require("./schema");

const validateProduct = (req,res,next)=>{
    let { name, price, image, description } = req.body;
    const { error } = productSchema.validate({ name, price, image, description });
    if (error) {
        return res.render('err', { err: "Validation failed" });
    }
    next();
};

const validateReview = (req,res,next)=>{
    let { rating, comment } = req.body;
    const { error } = reviewSchema.validate({ rating, comment });
    if (error) {
        return res.render('err', { err: "Validation failed" });
    }
    next();
};

const isLoggedin = (req,res,next)=>{
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        req.flash("error","Please login first");
        return res.redirect('/login');
    }
    next();
};

const isSeller = (req,res,next)=>{
    if (!req.user.role || req.user.role !== 'seller') {
        req.flash("error","You do not have permission to do that");
        return res.redirect('/products');
    }
    next();
};

const isProductAuthor = async (req,res,next)=>{
    let {id} = req.params;
    const product = await Product.findById(id);
    if (!product) {
        req.flash("error", "Product not found!");
        return res.redirect('/products');
    }
    if (!product.author.equals(req.user._id)) {
        req.flash("error","You do not have permission to do that");
        return res.redirect('/products');
    }
    next();
};

const isReviewAuthor = async (req,res,next)=>{
    let { pro_id, rev_id } = req.params;
    const review = await Review.findById(rev_id);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect('/products');
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/product/${pro_id}`);
    }
    next();
};

module.exports = {
    isLoggedin,
    validateReview,
    validateProduct,
    isSeller,
    isProductAuthor,
    isReviewAuthor
};
