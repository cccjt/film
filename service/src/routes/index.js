var express = require("express");
var router = express.Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  let title = "unicloud express";
  res.send(`<p>Welcome to ${title}</p>`);
});

module.exports = router;
