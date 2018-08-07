const express = require("express");
const app = express();

app.use(require("body-parser").json());

app.get("/testavatar", function(req, res, next) {
  res.send({'name':'John Doe Test','png':'BASE64STRINGOFPNG'});
});

let port = process.env.PORT || 8081;
app.listen(port, function() {
  console.log("AVATAR -- To view your app, open this link in your browser: http://localhost:" + port);
});

module.exports = app;
