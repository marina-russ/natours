const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ==========================
// === CRUD: ADMIN UPDATING
// ==========================

exports.getUserByID = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.createUser = (req, res) => {
  // User creation is done in authController at .signup
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead.",
  });
};
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
// ! Do NOT update passwords with .updateUser!
exports.deleteUser = factory.deleteOne(User);

// ==========================
// === CRUD: USER UPDATING
// ==========================

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1 - Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword instead.",
        400
      )
    );
  }

  // 2 - Define what the user is allowed to update
  // TODO - add additional fields such as changing uploaded avatar image.
  const filteredBody = filterObj(req.body, "name", "email");

  // 3 - Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { activeAccount: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
