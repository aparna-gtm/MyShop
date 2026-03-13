const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();


// sign up form
router.get('/register', (req, res) => {
    res.render('users/signup');
})
router.post('/register', async (req, res, next) => {
    try {
        let { email, username, password, role } = req.body;
        const user = new User({ email, username, role });
        const newUser = await User.register(user, password); 
        // auto login
        req.login(newUser, function(err){
            if(err){
                return next(err);
            }
            req.flash("success", `Welcome ${username} !`);
            res.redirect('/products');
        });
    } catch (err) {
        console.log(err); // <--- log the full error
        req.flash("error",  err.message); 
        res.redirect('/register');
    }
});


// login form 
router.get("/login",(req,res)=>{
    res.render("users/login");
})

// actual login from db

router.post('/login', passport.authenticate('local', { failureRedirect: '/login',failureFlash: 'Invalid username or password!'}),
    (req, res) => {
        req.flash("success","Welcome back friend!")
        res.redirect('/products');
    })



// log out
router.get("/logout",(req,res)=>{
    ()=>{
        req.logout();
    }
    req.flash("success","See you soon friend");
    res.redirect("/login");
})


module.exports = router;

