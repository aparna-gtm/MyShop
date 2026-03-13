const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const {validateProduct,isLoggedin,isSeller,isProductAuthor}=require("../middleware")



// to get all the products
router.get("/products", async (req, res) => {
    try {
        let products = await Product.find({});
        res.render("products/index", { products });
       
    }
    catch (err) {
        res.status(500).render("err", { err: err.message })
    }
})

// get a form to add new product
router.get("/product/new",isLoggedin,isSeller, (req, res) => {
    try {
        res.render("products/new");
    }
    catch (err) {
        res.status(500).render("err", { err: err.message })
    }
})

// actually add the product in the db
router.post("/products",validateProduct,isLoggedin,isSeller, async (req, res) => {
    try {
        let { name, image, description, price } = req.body;
        await Product.create({ name, image, description, price,author:req.user._id });
        req.flash("success","Product Added Successfully");
        res.redirect("/products");
    }
    catch (err) {
        res.status(500).render("err", { err: err.message })
    }

})

// show a particular product
router.get("/product/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let foundProduct = await Product.findById(id).populate("reviews");
        res.render("products/show", { foundProduct ,msg:req.flash('msg')});
    }
    catch (err) {
        res.status(500).render("err", { err: err.message })
    }
})

// show form to edit a product
router.get("/product/:id/edit",isLoggedin,isSeller,isProductAuthor, async (req, res) => {
    try {
        let { id } = req.params;
        let foundProduct = await Product.findById(id);
        res.render("products/edit", { foundProduct });
    }
    catch (err) {
        res.status(500).render("err", { err: err.message })
    }
})

// actually edit the product in db
router.patch("/product/:id", validateProduct,isLoggedin,isSeller,isProductAuthor, async (req, res) => {
    try {
        let { id } = req.params;
        let { name, image, description, price } = req.body;
        await Product.findByIdAndUpdate(id, { name, image, description, price });
        req.flash("success","Product Edited Successfully");
        res.redirect(`/product/${id}`);
    }
    catch (err) {
        res.status(500).render("err", { err: err.message })
    }
})

// delete the product from db
router.delete("/product/:id",isLoggedin,isSeller,isProductAuthor, async (req, res) => {
    try {
        let { id } = req.params;

        let product = await Product.findById(id);
        await Product.findByIdAndDelete(id);
        req.flash("success","Product Deleted Successfully");
        res.redirect('/products');
    }
    catch (err) {
        res.status(500).render("err", { err: err.message })
    }
})
















module.exports = router;














module.exports = router;
