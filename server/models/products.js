const mongoose = require(`mongoose`);

let productPhotosSchema = new mongoose.Schema({
  filename: { type: String },
});

let productsSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    photos: [productPhotosSchema],
    stock: { type: Number },
  },
  {
    collection: `products`,
  }
);

module.exports = mongoose.model(`products`, productsSchema);
