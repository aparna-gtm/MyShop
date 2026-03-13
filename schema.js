const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    
});

const reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    comment: Joi.string().required()
  
});

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('buyer', 'seller').default('buyer')
});

module.exports = { productSchema, reviewSchema, userSchema };
