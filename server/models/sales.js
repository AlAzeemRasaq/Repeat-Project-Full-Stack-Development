const mongoose = require(`mongoose`);

let productInfoSchema = new mongoose.Schema({
  productId: { type: String },
  productName: { type: String },
  quantity: { type: Number, default: 1 },
  productPrice: { type: Number },
});

let salesSchema = new mongoose.Schema(
  {
    paypalPaymentID: { type: String, required: true },
    productInfos: [productInfoSchema],
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
  },
  {
    collection: `sales`,
  }
);

module.exports = mongoose.model(`sales`, salesSchema);
