const mongoose=require("mongoose");
const Review = require("./Review");
const User = require("./User");

 const productSchema=mongoose.Schema({
     name:{
        type:String,
        trim:true,
        required:true
     },
     image:{
        type:String,
        trim:true,
        required:true
     },
     price:{
        type:Number,
        min:0,
        required:true
     },
     description:{
        type:String,
        trim:true,
        required:true
     },
     reviews:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Review"
      }
     ],
     author:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required: true
     }
 })

// middlware
productSchema.post("findOneAndDelete", async function (product) {
    if (product && product.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});

let Product= mongoose.model("Product",productSchema);
module.exports=Product;