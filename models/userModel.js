const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password should be at least 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please re-enter your password"],
    validate: {
      // Only works on CREATE or SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
});

// Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Encrypts user password (when signing up)
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  // Ensures that .passwordChangedAt is not added on signup, only on password reset
  if (!this.isModified("password") || this.isNew) return next();

  // Ensures that iat of JWT (issued at timestamp) is always timestamped AFTER password is changed.
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance Methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(
    `🔐Password Reset Token:🔐`,
    { resetToken },
    this.passwordResetToken
  );

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Exports
const User = mongoose.model("User", userSchema);

module.exports = User;
