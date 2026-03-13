const mongoose=require("mongoose");
const Product=require("./models/Product");
const products=[
    {
        name:"Iphone",
        image:"https://plus.unsplash.com/premium_photo-1681233751666-612c7bc77485?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:120000,
        description:"Very costly to buy"
    },
    {
        name:"Headphones",
        image:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:10000,
        description:"Very high rate"
    },
    {
        name:"TV",
        image:"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:89000,
        description:"Good Looking"
    },
    {
        name:"Watch",
        image:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:100,
        description:"Attractive product"
    }
]

async function seedDB(){
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("data seeded successfully");
}

module.exports=seedDB;