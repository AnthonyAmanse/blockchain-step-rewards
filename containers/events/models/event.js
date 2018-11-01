const mongoose = require("mongoose");

// eslint-disable-next-line
let eventSchema = mongoose.Schema({
  eventId: {type: String, unique: true, index: true},
  name: String,
  description: String,
  eventStatus: String,
  approvalStatus: String,
  owner: String,
  link: String,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model("Event", eventSchema);