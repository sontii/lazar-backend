const express = require("express");
const login = require("../queries/loginQuery");
const router = express.Router();

router.post("/", login.loginPost)

module.exports = router;