import mongoose from "mongoose";
import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
  console.log("💥 UNHANDLED EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
//environmental variables must always be read before ./app
import app from "./app.js";

const dB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//console.log(`-------------\nNODE_ENV Mode: ⚒️  ${process.env.NODE_ENV}`);

mongoose.connect(dB).then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});

process.on("unhandledRejection", (err) => {
  console.log("💥 UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
