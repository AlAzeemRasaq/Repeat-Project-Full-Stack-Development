const router = require(`express`).Router(); // Create a new router object from Express
const cartModel = require(`../models/cart`); // Import the cart model to interact with the cart collection in the database
const jwt = require("jsonwebtoken"); // Import JSON Web Token for authentication
const fs = require("fs"); // File system module for reading files
const multer = require("multer"); // Multer is a middleware for handling file uploads
const { get } = require("http");
var upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` });

// Read the private key used for signing JWTs from a file
const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  "utf8"
);

// Middleware to verify the JWT from the request headers
const verifyUsersJWTPassword = (req, res, next) => {
  jwt.verify(
    req.headers.authorization, // JWT token from the request headers
    JWT_PRIVATE_KEY, // Private key to verify the token
    { algorithm: "HS256" }, // Specify the algorithm used for signing
    (err, decodedToken) => { // Callback function after verification
      if (err) {
        return next(err); // If verification fails, pass the error to the next middleware
      }

      req.decodedToken = decodedToken; // Attach the decoded token to the request object
      return next(); // Continue to the next middleware
    }
  );
};

// Controller to get all cart items
const getAllCartsItems = (req, res, next) => {
  cartModel.find((error, data) => { // Fetch all cart items from the database
    res.json(data); // Send the cart items as a JSON response
  });
};

// Controller to get cart items for a specific user
const getUsersCartItems = (req, res, next) => {
  cartModel.find({ userId: req.params.id }, (error, data) => { // Find cart items by user ID
    if (error) {
      res.status(500).json({ errorMessage: "Internal Server Error" }); // Return a 500 error if there's a problem
    } else {
      res.json(data); // Send the user's cart items as a JSON response
    }
  });
};

// Middleware to check if a cart item already exists for a user
const checkIfCartItemExists = (req, res, next) => {
  cartModel.findOne(
    { userId: req.body.userId, productId: req.body.productId }, // Search for an existing cart item by user and product IDs
    (error, data) => {
      if (error) {
        res.status(500).json({ errorMessage: "Internal Server Error" }); // Return a 500 error if there's a problem
      } else {
        req.data = data; // Attach the found cart item to the request object
        return next(); // Continue to the next middleware
      }
    }
  );
};

// Controller to create or update a cart item
const createCartItem = (req, res, next) => {
  if (req.data) {
    // If the cart item already exists, increment its quantity
    req.data.quantity += 1;
    cartModel.updateOne(
      { _id: req.data._id }, // Find the cart item by its ID
      { quantity: req.data.quantity }, // Update the quantity
      (updateError) => {
        if (updateError) {
          res.json({
            errorMessage: `Failed to update cart item quantity`, // Send an error message if update fails
          });
        } else {
          res.json(req.data); // Send the updated cart item as a response
        }
      }
    );
  } else { // If the cart item does not exist, create a new one
    let cartDetails = {
      productId: req.body.productId,
      userId: req.body.userId,
      quantity: req.body.quantity,
      productPrice: req.body.productPrice,
    };
    cartModel.create(cartDetails, (createError, createdCartItem) => {
      if (createError) {
        res.json({ errorMessage: `Failed to add to cart` }); // Send an error message if creation fails
      } else {
        res.json(createdCartItem); // Send the created cart item as a response
      }
    });
  }
};

// Controller to increase the quantity of a cart item
const increaseCartItemQuantity = (req, res, next) => {
  cartModel.findOneAndUpdate(
    { userId: req.body.userId, productId: req.body.productId }, // Find the cart item by user and product IDs
    { $inc: { quantity: req.body.quantity } }, // Increment the quantity by the specified amount
    { returnOriginal: false }, // Return the updated document
    (err, data) => {
      if (err) {
        return next(err); // Pass the error to the next middleware if any
      }
      req.data = data; // Attach the updated cart item to the request object
      return next(); // Continue to the next middleware
    }
  );
};

// Middleware to delete a cart item if its quantity is zero
const deleteIfQuantityIsZero = (req, res, next) => {
  if (req.data.quantity <= 0) {
    // Check if the cart item quantity is zero or less
    cartModel.deleteOne(
      { userId: req.body.userId, productId: req.body.productId }, // Delete the cart item by user and product IDs
      (deleteError) => {
        if (deleteError) {
          res.json({
            errorMessage: `An error occurred while deleting cart item`, // Send an error message if deletion fails
          });
        } else {
          cartModel.find(
            { userId: req.body.userId }, // Fetch remaining cart items for the user
            (findError, cartItems) => {
              if (findError) {
                res.json({
                  errorMessage: `An error occurred while fetching cart items`, // Send an error message if fetch fails
                });
              }
              res.json({
                cart: cartItems, // Send the remaining cart items
                deleteMessage: "Item deleted successfully", // Send a success message
                productId: req.body.productId, // Include the deleted product ID
              });
            }
          );
        }
      }
    );
  } else {
    res.json(req.data); // If the quantity is not zero, send the updated cart item
  }
};

// Controller to empty a user's cart
const emptyUserCart = (req, res, next) => {
  cartModel.deleteMany({ userId: req.params.id }, (err) => { // Delete all cart items for a user by user ID
    if (err) {
      return next(err); // Pass the error to the next middleware if any
    }
    res.json({ message: "User cart emptied successfully" }); // Send a success message
  });
};

// Define routes and attach the respective middleware and controllers
router.get(`/cart`, getAllCartsItems); // Route to get all cart items
router.get(`/cart/:id`, verifyUsersJWTPassword, getUsersCartItems); // Route to get cart items for a specific user, with JWT verification
router.post(
  `/cart`,
  upload.array(), // Handle file uploads (if any)
  verifyUsersJWTPassword, // Verify JWT
  checkIfCartItemExists, // Check if the cart item already exists
  createCartItem // Create or update the cart item
);
router.put(
  `/cart/:id`,
  verifyUsersJWTPassword, // Verify JWT
  increaseCartItemQuantity, // Increase the quantity of a cart item
  deleteIfQuantityIsZero // Delete the cart item if the quantity is zero
);
router.delete(`/cart/:id`, emptyUserCart); // Route to empty a user's cart

module.exports = router; // Export the router to be used in the main server file