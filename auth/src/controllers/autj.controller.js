const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  try {
    // get details from body
    console.log("post");

    const {
      password,
      email,
      username,
      fullname: { firstname, lastname },
    } = req.body;

    // finding for existing user
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "username or email already exists" });
    }

    //create a new user
    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email,
      fullname: { firstname, lastname },
      password: hashedPw,
    });

    // create a token
    const token = jwt.sign(
      {
        id: newUser._id,
        username,
        email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //setting it in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    // sending success response
    return res
      .status(201)
      .json({ message: "user created successfully", user: newUser });
  } catch (error) {
    console.log("error on registering user", error);
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .select("+password");

    if (!user) return res.status(404).json({ message: "no user found" });

    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch)
      return res.status(400).json({ message: "invalid credentials" });

    // create a token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //setting it in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    // sending success response
    return res.status(201).json({ message: "user logedin successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internl server error", error });
  }
}

async function getMe(req, res) {
  return res.status(200).json({
    message: "got user data sucessfully",
    user: req.user,
  });
}

async function logoutUser(req, res) {}
module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
