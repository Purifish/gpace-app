const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// const getUsers = async (req, res, next) => {
//   let users;

//   try {
//     /* Include all properites except "password" */
//     users = await User.find({}, "-password");
//   } catch (err) {
//     return next(new HttpError("Error fetching users, try again later", 500));
//   }

//   res.json({
//     users: users.map((user) => user.toObject({ getters: true })),
//   });
// };

/* Done */
const signup = async (req, res, next) => {
  /* Check validation result */
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    return next(new HttpError("Invalid input detected.", 422));
  }

  const { name, email, password } = req.body;
  console.log(email);

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("There is already an existing account with this email", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Error creating new user, try again later", 500));
  }

  const newUser = new User({
    name: name,
    email: email,
    image: req.file ? req.file.path : "",
    password: hashedPassword,
    privilege: "user",
    notes: [],
    videos: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Failed to create user, try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        privilege: newUser.privilege,
      },
      process.env.JWT_KEY, // private key
      { expiresIn: "1h" } // expires after 1 hour
    );
  } catch (err) {
    const error = new HttpError("Failed to create user, try again.", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Successfully signed up",
    userId: newUser.id,
    email: newUser.email,
    privilege: newUser.privilege,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  console.log(email);
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later", 500)
    );
  }

  if (!existingUser) {
    return next(new HttpError("User does not exist!", 401));
  }

  let isValidPassword = false;
  try {
    // compare the password with its hash
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError("Login failed, please try again later", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Wrong password!", 401));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        privilege: existingUser.privilege,
      },
      process.env.JWT_KEY, // private key, must be same as signup token
      { expiresIn: "1h" } // expires after 1 hour
    );
  } catch (err) {
    const error = new HttpError("Failed to log in, try again.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    privilege: existingUser.privilege,
    token: token,
  });
};

// exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
