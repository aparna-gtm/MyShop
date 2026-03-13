require('dotenv').config();
const express=require("express");
const app=express();
const path=require("path");
const seedDB=require("./seed")
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const session=require("express-session");
const flash=require("connect-flash");
const localStrategy=require("passport-local")
const passport=require("passport")
const User=require("./models/User")


//for session
let configSession={
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000
  }
}

// middleware for session
app.use(session(configSession))

// Middlwares for passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// db connection
const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Atlas connected!"))
.catch(err => console.log("MongoDB connection error:", err));


// setting the paths
app.set("view engine","ejs");
app.engine("ejs",ejsMate);

app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

// middleware for reading the form's data
app.use(express.urlencoded({extended:true}));

// middlware for method-override
app.use(methodOverride("_method"));

// seeding the data
// seedDB(); comment it out after running once


// using flash
app.use(flash());

// middleware for local
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    next();
})


// Passport middlewware
passport.use(new localStrategy(User.authenticate()));



// requiring route
const Product=require("./routes/product");
const Review=require("./routes/review")
const Auth=require("./routes/auth");
const cart=require("./routes/cart");
const wishlistRoutes = require('./routes/wishlist');
const paymentRoutes = require('./routes/payment');




// use the routes
app.use(Product);
app.use(Review);
app.use(Auth);
app.use(cart);
app.use( wishlistRoutes);
app.use(paymentRoutes);
app.use('/payment_gateway', paymentRoutes);


app.get("/", (req, res) => {
  res.redirect("/products");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});