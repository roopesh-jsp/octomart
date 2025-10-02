const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../../db/redis");

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
      role,
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
      role: role || "user",
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

async function logoutUser(req, res) {
  const token = req.cookies.token;
  if (token) {
    await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60); //we blacklist for 1 day only beacuse after 1 day the token itself will be invalid so no need to maintain in the redis again
  }
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({ message: "user logged out" });
}

// address
async function getAllAddresses(req, res) {
  try {
    const id = req.user.id;
    const user = await userModel.findById(id).select("adderess");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json({
      message: "user address fetched sucessfully",
      address: user.adderess,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function addAddress(req, res) {
  try {
    const id = req.user.id;
    const { street, city, state, zip, country, isDefault, phone } = req.body;
    const user = await userModel.findByIdAndUpdate(
      id,
      {
        $push: {
          adderess: {
            street,
            city,
            state,
            zip,
            country,
            isDefault,
            phone,
          },
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(201).json({
      message: "user address added sucessfully",
      address: user.adderess,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
}
async function deleteAddress(req, res) {
  try {
    const id = req.user.id;
    const { addressId } = req.params;
    console.log(id, addressId);

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          adderess: {
            _id: addressId,
          },
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(201).json({
      message: "user address deleted sucessfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
}
module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  getAllAddresses,

  addAddress,
  deleteAddress,
};
