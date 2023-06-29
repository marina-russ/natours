const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
//environmental variables must always be read before ./app
const app = require("./app");

const dB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//console.log(`-------------\nNODE_ENV Mode: ⚒️  ${process.env.NODE_ENV}`);

mongoose
  .connect(dB)
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});