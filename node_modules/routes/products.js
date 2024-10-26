const router = require(`express`).Router(); // Create a new router object from Express
const productsModel = require(`../models/products`); // Import the products model to interact with the products collection in the database
const jwt = require("jsonwebtoken"); // Import JSON Web Token for authentication
const fs = require("fs"); // File system module for reading files
const multer = require("multer"); // Multer is a middleware for handling file uploads
var upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` }); // Configure multer to upload files to a specified folder

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

// Middleware to check if the user has admin privileges
const checkThatUserIsAnAdministrator = (req, res, next) => {
  if (req.decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) { // Check if the user's access level meets or exceeds the admin level
    return next(); // If the user is an admin, proceed to the next middleware
  } else {
    return next(createError(401)); // If the user is not an admin, return a 401 Unauthorized error
  }
};

// Middleware to validate product details before adding or updating
const verifyProduct = (req, res, next) => {
  // Check if the product name contains only letters
  if (!/^[a-zA-Z]+$/.test(req.body.name)) {
    return next(createError(400, `The product name is invalid`)); // Return a 400 error if the name is invalid
  // Check if the product price is within the allowed range
  } else if (req.body.price < 0 || req.body.price > 1000) {
    return next(
      createError(
        400,
        `The price of the product needs to be greater than 0 and less than 1000` // Return a 400 error if the price is outside the allowed range
      )
    );
  } else {
    return next(); // If all validations pass, proceed to the next middleware
  }
};

const getPhotos = (req, res, next) => {
  fs.readFile(
    `${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`,
    "base64",
    (err, fileData) => {
      if (err) {
        return next(err);
      }
      if (fileData) {
        return res.json({ image: fileData });
      } else {
        return res.json({ image: null });
      }
    }
  );
};

// Controller to get all products
const getAllProducts = (req, res, next) => {
  productsModel.find((error, data) => { // Fetch all products from the database
    res.json(data); // Send the products as a JSON response
  });
};

// Controller to get a single product by ID
const getOneProduct = (req, res, next) => {
  productsModel.findById(req.params.id, (err, data) => { // Find a product by its ID
    if (err) {
      return next(err); // Pass the error to the next middleware if there's an issue
    }
    return res.json(data); // Send the product data as a JSON response
  });
};


// Controller to add a new product
const addProduct = (req, res, next) => {
  let productDetails = new Object();

  // Assign product details from the request body
  productDetails.name = req.body.name;
  productDetails.price = req.body.price;
  productDetails.stock = req.body.stock;
  productDetails.photos = [];

  // Map the uploaded files to the product's photos array
  req.files.map((file, index) => {
    productDetails.photos[index] = { filename: `${file.filename}` };
  });

  // Create a new product in the database
  productsModel.create(productDetails, (err, data) => {
    if (err) {
      return next(err); // Pass the error to the next middleware if there's an issue
    }

    return res.json(data); // Send the created product data as a JSON response
  });
};

// Controller to edit an existing product
const editProduct = (req, res, next) => {
  let productDetails = new Object();

  // Assign updated product details from the request body
  productDetails.name = req.body.name;
  productDetails.price = req.body.price;
  productDetails.stock = req.body.stock;
  productDetails.photos = [];

  // Map the uploaded files to the product's photos array
  req.files.map((file, index) => {
    productDetails.photos[index] = {
      filename: `${file.filename}`,
    };
  });

  // Update the product in the database by its ID
  productsModel.findByIdAndUpdate(
    req.params.id,
    { $set: productDetails }, // Set the updated product details
    (err, data) => {
      if (err) {
        return next(err); // Pass the error to the next middleware if there's an issue
      }

      return res.json(data); // Send the updated product data as a JSON response
    }
  );
};

// Controller to delete a product by ID
const deleteProduct = (req, res, next) => {
  productsModel.findByIdAndRemove(req.params.id, (err, data) => { // Remove the product from the database by its ID
    if (err) {
      return next(err); // Pass the error to the next middleware if there's an issue
    }

    return res.json(data); // Send the deleted product data as a JSON response
  });
};

// Define routes and attach the respective middleware and controllers
router.get(`/products/photo/:filename`, getPhotos); // Route to get a product photo by filename
router.get(`/products`, getAllProducts); // Route to get all products
router.get(`/products/:id`, getOneProduct); // Route to get a single product by ID
router.post(
  `/products`,
  upload.array(
    "productPhotos",
    parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED) // Handle multiple photo uploads for the product
  ),
  verifyUsersJWTPassword, // Verify JWT
  checkThatUserIsAnAdministrator, // Check if the user is an admin
  verifyProduct, // Validate the product details
  addProduct // Add the product to the database
);

router.put(
  `/products/:id`,
  upload.array(
    "productPhotos",
    parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED) // Handle multiple photo uploads for the product
  ),
  verifyUsersJWTPassword, // Verify JWT
  checkThatUserIsAnAdministrator, // Check if the user is an admin
  verifyProduct, // Validate the product details
  editProduct // Update the product in the database
);

router.delete(
  `/products/:id`,
  verifyUsersJWTPassword, // Verify JWT
  checkThatUserIsAnAdministrator, // Check if the user is an admin
  deleteProduct // Delete the product from the database
);

module.exports = router; // Export the router to be used in the main server file