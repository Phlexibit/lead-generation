const express = require("express");
const router = express.Router();
const { 
    processMessage, 
    autoDelegate 
} = require("./controller");

router.route("/message").post(processMessage);
router.route("/auto-delegate").post(autoDelegate);

module.exports = router;
