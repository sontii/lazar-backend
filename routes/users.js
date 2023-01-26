const express = require("express");
const users = require("../queries/usersQuery");
const router = express.Router();

router.get("/", users.userGet)

router.post("/", users.userPost)

module.exports = router;
