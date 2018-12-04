const express = require("express");
const router = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
var AWS = require('ibm-cos-sdk');
var util = require('util');

var config = {
    endpoint: process.env.COS_ENDPOINT,
    apiKeyId: process.env.COS_API_KEY,
    ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
    serviceInstanceId: process.env.COS_SERVICE_INSTANCE_ID,
};

var cos = new AWS.S3(config);

// List buckets
router.get("/", function(req, res) {
  cos.listBuckets()
    .promise()
    .then(function (data) {
      res.send(data.Buckets)
    })
});

// get bucket
router.get("/:bucketName", function(req, res) {
  cos.listObjects({
      Bucket: req.params.bucketName
    })
    .promise()
    .then(function (data) {
      res.send(data)
    })
    .catch(function (error) {
      res.send(error)
    })
});

// get object
router.get("/:bucketName/:objectName", function(req, res) {
  cos.getObject({
      Bucket: req.params.bucketName,
      Key: req.params.objectName
    })
    .promise()
    .then(function (data) {
      res.send(data.Body)
    })
    .catch(function (error) {
      res.send(error)
    })
});

// upload object
router.post("/:bucketName/:objectName", upload.single('image'), function(req, res) {
  cos.putObject({
    Bucket: req.params.bucketName,
    Key: req.params.objectName,
    Body: req.file.buffer
  }).promise()
    .then(function(data) {
      res.send(data)
    })
    .catch(function (error) {
      res.send(error)
    })
});

module.exports = router;