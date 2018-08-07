const express = require("express");
const router = express.Router();

const PagesFunction = require("../models/page");

router.use(function(req,res,next) {
  req.Pages = PagesFunction("pages-" + req.EVENT_NAME)
  next();
});

// endpoints for pages
router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let addPage = new req.Pages(req.body);
  addPage.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Saved booklet page.");
    }
  });
});

router.get("/", function(req, res) {
  req.Pages.find({},{},{sort: { page: 1 }},function(err, pages) {
    if (err) {
      res.send(err);
    } else {
      res.send(pages);
    }
  });
});

router.get("/:page", function(req, res) {
  req.Pages.findOne({"page": parseInt(req.params.page)}, function(err, page) {
    if (err) {
      res.send(err);
    } else if (page) {
      if (req.params.page.split(".").pop() == "png") {
        res.contentType("image/png");
        res.send(new Buffer(page.imageEncoded, "base64"));
      }
      else {
        res.send(page);
      }
    } else {
      res.send("Page not found...");
    }
  });
});

module.exports = router;
