const Joi = require('joi');


const listingSchema = Joi.object({
    listing: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      country: Joi.string().required(),
      location: Joi.string().required()
    }).required()
  });
  

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

// ✅ Export both schemas
module.exports = {
    listingSchema,
    reviewSchema
};
