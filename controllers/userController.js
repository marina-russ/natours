const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // * EXECUTE QUERY
  const users = await User.find();

  // * SEND RESPONSE
  res.status(200).json({
    status: "success!",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.getUserByID = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
