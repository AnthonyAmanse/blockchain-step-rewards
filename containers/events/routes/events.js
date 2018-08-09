const express = require("express");
const router = express.Router();

const EventModel = require("../models/event");

// endpoints for pages
// Add an event
router.post("/", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let eventModel = new EventModel(req.body);
  eventModel.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send({"status":"success","message":"Event " + req.body.name + " saved."});
    }
  });
});

// get events
router.get("/", function(req, res) {
  EventModel.find(function(err, events) {
    if (err) {
      res.send(err);
    } else {
      res.send(events);
    }
  });
});

// get approved events
router.get("/approved", function(req, res) {
  EventModel.find({"approvalStatus": "approved"},function(err, events) {
    if (err) {
      res.send(err);
    } else {
      res.send(events);
    }
  });
});

// get fitltered by field events
router.get("/:field/:value", function(req, res) {
  var filter = {}
  filter[req.params.field] = req.params.value
  EventModel.find(filter,function(err, events) {
    if (err) {
      res.send(err);
    } else {
      res.send(events);
    }
  });
});

// update event
router.put("/:eventId", function(req, res) {
  EventModel.update({"eventId": req.params.eventId},
    { $set: req.body }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({"status":"success","message":"Updated event " + req.params.eventId});
      }
    });
});

router.get("/:eventId", function(req, res) {
  EventModel.findOne({"eventId": req.params.eventId}, function(err, event) {
    if (err) {
      res.send(err);
    } else if (event) {
      res.send(event);
    } else {
      res.send({"status":"not_found","message":"Event " + req.params.eventId + " not found."});
    }
  });
});

module.exports = router;
