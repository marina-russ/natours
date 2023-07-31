const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
    // unique: true,
    trim: true,
    maxlength: [20, "Name must be 20 characters or less"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password should be at least 8 characters long"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please re-enter your password"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
