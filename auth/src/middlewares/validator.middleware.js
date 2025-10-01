const { body, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerUserValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(), // Sanitizes the email address

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("fullname.firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long"),

  body("fullname.lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
  respondWithValidationErrors,
];

const loginUserValidation = [
  // 1. Validate that the password exists and is a string. This is always required.
  body("password").isString().notEmpty().withMessage("Password is required"),

  // 2. Add a custom validator to check if at least one of email or username is provided.
  //    We can attach it to the 'email' field's validation chain.
  body("email").custom((value, { req }) => {
    if (!value && !req.body.username) {
      // If neither email (value) nor username exists on the request body, throw an error.
      throw new Error("Either email or username is required for login");
    }
    // If at least one exists, the validation passes.
    return true;
  }),

  // 3. Conditionally validate email IF it is provided.
  //    .optional({ checkFalsy: true }) ensures this chain only runs if the field is not empty.
  body("email")
    .optional({ checkFalsy: true }) // Skips validation if field is empty, null, or undefined
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(), // Sanitizes the email address

  // 4. Conditionally validate username IF it is provided.
  body("username")
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage("Username must be a string"),

  // 5. Your custom middleware to handle the collected errors.
  respondWithValidationErrors,
];

module.exports = {
  registerUserValidation,
  loginUserValidation,
};
