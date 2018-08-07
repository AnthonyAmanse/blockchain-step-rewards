const mongoose = require("mongoose");

// eslint-disable-next-line
let pageSchema = mongoose.Schema({
  page: {type: Number, unique: true},
  link: String,
  title: String,
  subtitle: String,
  subtext: String,
  description: String,
  image: String,
  imageEncoded: String,
});

module.exports = function (collectionName) {
  return mongoose.model("Page", pageSchema, collectionName);
}