const router = require(`express`).Router(); // Create a new router object from Express
const usersModel = require(`../models/users`); // Import the users model to interact with the users collection in the database
const bcrypt = require("bcryptjs"); // Import bcrypt for hashing and comparing passwords
const jwt = require("jsonwebtoken"); // Import JSON Web Token for generating and verifying JWTs
const fs = require("fs"); // Import the File System module to interact with the file system

// Read the private key for signing JWTs from a file
const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  "utf8"
);

const multer = require("multer"); // Import multer for handling file uploads
const upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` }); // Set up multer to save uploaded files to a specific folder
const emptyFolder = require("empty-folder"); // Import empty-folder module to empty the contents of a folder

// Middleware to check if a user exists in the users collection by email
const checkThatUserExistsInUsersCollection = (req, res, next) => {
  usersModel.findOne({ email: req.params.email }, (err, data) => {
    if (err) {
      return next(err); // Pass error to the next middleware
    }

    req.data = data; // Store the user data in the request object
    return next(); // Move to the next middleware
  });
};

// Middleware to ensure a user does not already exist in the users collection by email
const checkThatUserIsNotAlreadyInUsersCollection = (req, res, next) => {
  usersModel.findOne({ email: req.params.email }, (err, data) => {
    if (err) {
      return next(err);
    }
    if (data) {
      return next(createError(401)); // If user already exists, throw a 401 error
    }
  });

  return next();
};

// Middleware to verify the user's password using bcrypt
const checkThatJWTPasswordIsValid = (req, res, next) => {
  bcrypt.compare(req.params.password, req.data.password, (err, result) => {
    if (err) {
      return next(err);
    }

    if (!result) {
      return next(createError(401)); // If password does not match, throw a 401 error
    }

    return next();
  });
};

// Middleware to verify the user's JWT
const verifyUsersJWTPassword = (req, res, next) => {
  jwt.verify(
    req.headers.authorization, // Get the JWT from the request headers
    JWT_PRIVATE_KEY, // Use the private key to verify the token
    { algorithm: "HS256" }, // Specify the algorithm used to sign the token
    (err, decodedToken) => {
      if (err) {
        return next(err);
      }

      req.decodedToken = decodedToken; // Store the decoded token in the request object
      return next();
    }
  );
};

// Middleware to check if the user has admin access
const checkThatUserIsAnAdministrator = (req, res, next) => {
  if (req.decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
    return next(); // Allow if access level is admin or higher
  } else {
    return next(createError(401)); // Throw a 401 error if not an admin
  }
};

// Middleware to ensure a file is uploaded
const checkThatFileIsUploaded = (req, res, next) => {
  if (!req.file) {
    return next(createError(400, `No file was selected to be uploaded`)); // Throw a 400 error if no file was uploaded
  }

  return next();
};

// Middleware to ensure the uploaded file is an image
const checkThatFileIsAnImageFile = (req, res, next) => {
  if (
    req.file.mimetype !== "image/png" &&
    req.file.mimetype !== "image/jpg" &&
    req.file.mimetype !== "image/jpeg"
  ) {
    // Delete the file if it is not an image
    fs.unlink(
      `${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`,
      (err) => {
        return next(err);
      }
    );
  }

  return next();
};

// Controller to get all users
const getAllUsers = (req, res, next) => {
  usersModel.find((error, data) => {
    res.json(data); // Send all users as a JSON response
  });
};

// Controller to get one user by ID
const getOneUser = (req, res, next) => {
  usersModel.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data); // Send the user data as a JSON response
  });
};

// Controller to empty the users collection
const emptyUsersCollection = (req, res, next) => {
  usersModel.deleteMany({}, (err, data) => {
    if (err) {
      return next(err);
    }

    if (!data) {
      return next(createError(409, `Failed to empty users collection`)); // Throw a 409 error if the collection could not be emptied
    }
  });

  return next();
};

// Controller to add an admin user to the users collection for testing
const addAdminUserToUsersCollection = (req, res, next) => {
  const adminPassword = `123!"£qweQWE`; // Define a default admin password
  bcrypt.hash(
    adminPassword, // Hash the admin password
    parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), // Use a salt for the hash
    (err, hash) => {
      if (err) {
        return next(err);
      }

      // Create the admin user
      usersModel.create(
        {
          name: "Administrator",
          email: "admin@admin.com",
          password: hash,
          accessLevel: parseInt(process.env.ACCESS_LEVEL_ADMIN),
        },
        (err, data) => {
          if (err) {
            return next(err);
          }

          if (!data) {
            return next(
              createError(
                409,
                `Failed to create Admin user for testing purposes`
              )
            );
          }

          // Empty the uploads folder after creating the admin user
          emptyFolder(process.env.UPLOADED_FILES_FOLDER, false, (result) => {
            return res.json(data);
          });
        }
      );
    }
  );
};

// Controller to register a new user
const registerUser = (req, res, next) => {
  bcrypt.hash(
    req.params.password, // Hash the user's password
    parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), // Use a salt for the hash
    (error, hash) => {
      usersModel.create(
        {
          name: req.params.name,
          email: req.params.email,
          password: hash,
          profilePhotoFilename: req.file.filename, // Store the filename of the uploaded profile photo
        },
        (err, data) => {
          if (data) {
            const token = jwt.sign(
              { email: data.email, accessLevel: data.accessLevel }, // Sign a JWT with the user's email and access level
              JWT_PRIVATE_KEY,
              {
                algorithm: "HS256",
                expiresIn: process.env.JWT_EXPIRY, // Set an expiry time for the token
              }
            );

            // Read the profile photo and send it back in the response
            fs.readFile(
              `${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`,
              "base64",
              (err, fileData) => {
                if (err) {
                  return next(err);
                }
                return res.json({
                  _id: data._id,
                  name: data.name,
                  accessLevel: data.accessLevel,
                  profilePhoto: fileData,
                  token: token, // Send the token along with the response
                });
              }
            );
          }
        }
      );
    }
  );
};

// Controller to log in a user
const loginUser = (req, res, next) => {
  const token = jwt.sign(
    { email: req.data.email, accessLevel: req.data.accessLevel }, // Sign a JWT with the user's email and access level
    JWT_PRIVATE_KEY,
    { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRY } // Set an expiry time for the token
  );

  // Check if the user has a profile photo
  if (req.data.profilePhotoFilename) {
    fs.readFile(
      `${process.env.UPLOADED_FILES_FOLDER}/${req.data.profilePhotoFilename}`,
      "base64",
      (err, data) => {
        if (err) {
          return next(err);
        }

        if (data) {
          res.json({
            _id: req.data._id,
            name: req.data.name,
            accessLevel: req.data.accessLevel,
            profilePhoto: data, // Include the profile photo in the response
            token: token, // Include the token in the response
          });
        } else {
          return res.json({
            _id: req.data._id,
            name: req.data.name,
            accessLevel: req.data.accessLevel,
            profilePhoto: null, // If no profile photo, send null
            token: token,
          });
        }
      }
    );
  } else {
    return res.json({
      _id: req.data._id,
      name: req.data.name,
      accessLevel: req.data.accessLevel,
      profilePhoto: null,
      token: token,
    });
  }
};

// Controller to log out a user
const logoutUser = (req, res, next) => {
  res.json({}); // Send an empty response to indicate logout
};

// Controller to delete a user by ID
const deleteUser = (req, res, next) => {
  usersModel.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data); // Send the deleted user data as a JSON response
  });
};

// Route definitions
router.get(`/users`, getAllUsers); // Route to get all users
router.get(`/users/:id`, getOneUser); // Route to get a user by ID
router.post(
  `/users/reset_user_collection`, // Route to reset the user collection
  emptyUsersCollection,
  addAdminUserToUsersCollection
);
router.post(
  `/users/register/:name/:email/:password`, // Route to register a new user
  upload.single("profilePhoto"), // Use multer to handle the profile photo upload
  checkThatFileIsUploaded,
  checkThatFileIsAnImageFile,
  checkThatUserIsNotAlreadyInUsersCollection,
  registerUser
);
router.post(
  `/users/login/:email/:password`, // Route to log in a user
  checkThatUserExistsInUsersCollection,
  checkThatJWTPasswordIsValid,
  loginUser
);
router.post(`/users/logout`, logoutUser); // Route to log out a user
router.delete(
  `/users/:id`, // Route to delete a user by ID
  verifyUsersJWTPassword, // Middleware to verify JWT and check if the user is an admin
  checkThatUserIsAnAdministrator,
  deleteUser
);

module.exports = router; // Export the router to be used in the main server file