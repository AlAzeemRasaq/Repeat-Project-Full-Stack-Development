const mongoose = require(`mongoose`);

let cartSchema = new mongoose.Schema(
  {
    productId: { type: String },
    userId: { type: String },
    quantity: { type: Number },
    productPrice: { type: Number },
  },
  {
    collection: `cart`,
  }
);

module.exports = mongoose.model(`cart`, cartSchema);
