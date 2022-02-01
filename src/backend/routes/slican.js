const express = require("express");
const router = express.Router();

const Slican = require("../src/service/SlicanService");

router.post("/web-ivr", async (req, res, next) => {
  Slican.webIVRPostProcess(req, res);
});

module.exports = router;
