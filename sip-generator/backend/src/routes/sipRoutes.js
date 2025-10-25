const express = require("express");
const router = express.Router();
const sipController = require("../controllers/sipController");

router.post("/generate-sip", sipController.generateSip);
router.post("/validate-sip", sipController.validateSip);

module.exports = router;
