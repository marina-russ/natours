import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tour from "./../models/tourModel.js";
import User from "./../models/userModel.js";
import Review from "./../models/reviewModel.js";

dotenv.config({ path: "./config.env" });

const dB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(dB).then(() => console.log("DB connection successful!"));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL PLACEHOLDER DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// RUNNING SCRIPT
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
