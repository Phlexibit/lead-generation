const express = require("express");
const router = express.Router();
const { 
    createChatSession,
    getChatSession,
    getSessionList
} = require("./controller");

router.route("/get-session").get(getChatSession);
router.route("/get-session-list").get(getSessionList);
router.route("/create-session").post(createChatSession);

module.exports = router;
