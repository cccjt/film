var express = require("express");
var router = express.Router();
const UniDBService = require("../services/UniDBService");

/* GET home page. */
router.post("/add", async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await UniDBService.add(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/update", async (req, res, next) => {
  try {
    const result = await UniDBService.update(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/get", async (req, res, next) => {
  try {
    const result = await UniDBService.get(req.query);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/remove", async (req, res, next) => {
  try {
    const result = await UniDBService.remove(req.query);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
