const express = require("express");
const router = express.Router();
const request = require("request");

const RegistereesFunction = require("../models/registeree");

router.use(function(req, res, next) {
  req.Registerees = RegistereesFunction("registerees-" + req.EVENT_NAME)
  next();
});

// endpoints for registeree
router.get("/", function(req, res) {
  req.Registerees.find(function(err, registerees) {
    if (err) {
      res.send(err);
    }
    else {
      res.send(registerees);
    }
  });
});

router.get("/totalUsers", function(req, res) {
  req.Registerees.countDocuments(function(err, count) {
    if (err) {
      res.send(err);
    }
    else {
      res.send({"count":count});
    }
  });
});

router.get("/deviceTotals", function(req, res) {
  req.Registerees.countDocuments({device:"android"},function(err, androidCount) {
    if (err) {
      res.send(err);
    }
    else {
      req.Registerees.countDocuments({device:"ios"},function(err, iosCount) {
        if (err) {
          res.send(err);
        }
        else {
          res.send({"android": androidCount, "ios": iosCount});
        }
      });
    }
  });
});

router.get("/info/:registereeId", function(req, res) {
  req.Registerees.findOne(req.params, function(err, registeree) {
    if (err){
      res.send(err);
    } else if (registeree) {
      res.send(registeree);
    } else {
      res.send('Registeree not found...');
    }
  });
});

router.get("/totalCalories", function(req, res) {
  req.Registerees.aggregate([{ $group:
    { _id: null,
      count: {
        $sum: "$calories"
      }
    }
  }], function(err, totalCalories) {
    if(err) {
      res.send(err);
    } else if (totalCalories) {
      res.send(totalCalories);
    } else {
      res.send("Registeree.calories not found");
    }
  });
});

router.get("/totalSteps", function(req, res) {
  req.Registerees.aggregate([{ $group:
    { _id: null,
      count: {
        $sum: "$steps"
      }
    }
  }], function(err, totalSteps) {
    if (err) {
      res.send(err);
    } else if (totalSteps) {
      res.send(totalSteps);
    } else {
      res.send("Registeree.steps not found");
    }
  });
});

router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  var registeree = req.body
  request.get(process.env.CLOUDFUNCTION_AVATAR, function(error, response, body) {
    let json = JSON.parse(body);
    // returns {name: String, png: String}
    // TODO:
    // Insert validation if request has error
    // fallback to a default image
    registeree.name = json.name;
    registeree.png = json.png;
    let addRegisteree = new req.Registerees(registeree);

    addRegisteree.save( function(err) {
      if (err) {
        res.send(err);
      }
      else {
        res.send({name:registeree.name,png:registeree.png});
      }
    });
  });
});

router.post("/update/:registereeId/steps/:steps", function(req, res) {
  // JSON in req.body
  // Insert input validation
  req.Registerees.update({"registereeId": req.params.registereeId},
    {"steps": req.params.steps}, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send(`Update Registeree ${req.params.registereeId}'s steps.`);
      }
    });
});


router.post("/update/:registereeId/calories/:calories", function(req, res) {
  // JSON in req.body
  // Insert input validation
  req.Registerees.update({"registereeId": req.params.registereeId},
    {"calories": req.params.calories}, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send(`Update Registeree ${req.params.registereeId}'s calories.`);
      }
    });
});

module.exports = router;
