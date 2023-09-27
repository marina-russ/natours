const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

// ==========================
// === MULTER - IMAGES
// ==========================

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

// ==========================
// === CRUD: ADMIN UPDATING
// ==========================

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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
  if (req.file) filteredBody.photo = req.file.filename;

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
