const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      url: String,
      filename: String,
    },
    price: Number,
  
    // ✅ Renamed from location
    address: String,
    country: String,
  
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  
    // ✅ Location for GeoJSON
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      name: String 
    },
  });
  
    

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ reviews: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
