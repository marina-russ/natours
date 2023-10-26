import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Email from "../utils/email.js";

// =======================
// === JSON Web Token
// =======================

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // removes password from SignUp output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

// =======================
// === Authentication
// =======================

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: "user",
  });
  const url = `${req.protocol}://${req.get("host")}/me`;
  //console.log(url);
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new AppError("Please provide a valid email and password!", 400)
    );
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If both true, send token to client
  createSendToken(user, 200, res);
  //console.log(`🪵  ${user.name} is logged in!`);
});

// TODO !BUG - Not working correctly
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ status: "success" });
};

// =======================
// === Authorization
// =======================

export const protect = catchAsync(async (req, res, next) => {
  // 1 - Check for & get JWT
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.redirect("/");
  }

  // 2 - Verify JWT signature
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 - Confirm that user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 4 - Check if user changed password after JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed their password. Please log in again",
        401
      )
    );
  }

  // 5 - Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, doesn't throw errors!
export const isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1 - Verify JWT
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // 2 - Confirm that user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }
    // 3 - Check if user changed password after JWT was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }
    // 4 - There is a logged in user, so grant access to templates
    res.locals.user = currentUser;
    return next();
  }
  next();
});

export const restrictTo = (...roles) => {
  // ...roles = ["admin", "lead-guide"]
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

// =======================
// === Passwords
// =======================

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1 - Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }
  // 2 - Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3 - Send reset token to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later.",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1 - Encrypt token for comparison
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2 - Get user based on encrypted reset token, check token expiration
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 3 - If token is not expired && user exists, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 4 - Update changedPasswordAt property for user
  // * happens at userModel.js pre hook

  // 5 - Log in the user and send JWT
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1 - Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2 - Check if POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3 - If TRUE, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4 - Log user in with new password, send JWT
  createSendToken(user, 200, res);
});

//export default authController;
