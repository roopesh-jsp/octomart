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
  body("password").isString().notEmpty().withMessage("Password is required"),

  body("email").custom((value, { req }) => {
    if (!value && !req.body.username) {
      throw new Error("Either email or username is required for login");
    }

    return true;
  }),

  body("email")
    .optional({ checkFalsy: true }) // Skips validation if field is empty, null, or undefined
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("username")
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage("Username must be a string"),

  respondWithValidationErrors,
];

const addAddressValidator = [
  body("street").trim().notEmpty().withMessage("Street is required"),

  body("city").trim().notEmpty().withMessage("City is required"),

  body("state").trim().notEmpty().withMessage("State is required"),

  body("zip")
    .trim()
    .notEmpty()
    .withMessage("ZIP code is required")
    .isPostalCode("any")
    .withMessage("Invalid ZIP/postal code"),

  body("country").trim().notEmpty().withMessage("Country is required"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  respondWithValidationErrors,
];
module.exports = {
  registerUserValidation,
  loginUserValidation,
  addAddressValidator,
};
