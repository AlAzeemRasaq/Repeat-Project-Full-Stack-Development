const router = require(`express`).Router(); // Create a new router object from Express
const salesModel = require(`../models/sales`); // Import the sales model to interact with the sales collection in the database
const multer = require("multer"); // Import multer for handling form-data (multipart/form-data)
const upload = multer(); // Initialize multer with default settings (no file storage, used for parsing form-data)
const productsModel = require(`../models/products`); // Import the products model to interact with the products collection in the database

// Controller to create a new sale document
const createNewSaleDocument = (req, res, next) => {
  let saleDetails = new Object(); // Create a new object to store sale details
  saleDetails.paypalPaymentID = req.params.orderID; // Assign PayPal payment ID from the request parameters
  saleDetails.productInfos = JSON.parse(req.body.productInfos); // Parse product information from the request body
  saleDetails.userId = req.params.userId; // Assign user ID from the request parameters
  saleDetails.price = req.params.price; // Assign sale price from the request parameters
  saleDetails.customerName = req.params.customerName; // Assign customer name from the request parameters
  saleDetails.customerEmail = req.params.customerEmail; // Assign customer email from the request parameters

  // Loop through each product in the sale details to update stock levels
  for (let i = 0; i < saleDetails.productInfos.length; i++) {
    const productInfo = saleDetails.productInfos[i]; // Get the current product info
    productsModel.updateOne(
      { _id: productInfo.productId }, // Find the product by its ID
      { $inc: { stock: -productInfo.quantity } }, // Decrease the stock by the quantity sold
      (error) => {
        if (i === saleDetails.productInfos.length - 1) {
          // Log success message after the last product's stock is updated
          console.log("All stock levels updated successfully");
        }
      }
    );
  }

  // Create a new sale document in the database
  salesModel.create(saleDetails, (err, data) => {
    if (err) {
      return next(err); // Pass any error to the next middleware if there's an issue
    }
  });

  return res.json({ success: true }); // Send a success response to the client
};

// Controller to get sales for a specific user
const getUserSales = (req, res, next) => {
  salesModel.find({ userId: req.params.id }, (error, data) => { // Find sales by user ID
    if (error) {
      res.status(500).json({ errorMessage: "Internal Server Error" }); // Send a 500 error response if there's an issue
    } else {
      res.json(data); // Send the sales data as a JSON response
    }
  });
};

// Define route to create a new sale
router.post(
  "/sales/:orderID/:userId/:price/:customerName/:customerEmail", // Define route with parameters for sale creation
  upload.none(), // Use multer middleware to handle form-data without file uploads
  createNewSaleDocument // Attach the controller to handle creating a new sale
);

// Define route to get sales for a specific user
router.get("/sales/:id", getUserSales); // Attach the controller to handle retrieving user sales

module.exports = router; // Export the router to be used in the main server file