const express = require('express')
const router = express.Router()
const nomenklatura = require("../queries/nomenklaturaQuery")
const authenticateToken = require('../middleware/authtoken')

router.get("/", authenticateToken, nomenklatura.nomenklatura)

module.exports = router
