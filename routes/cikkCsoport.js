const express = require('express')
const router = express.Router()
const cikkCsoport = require('../queries/cikkCsoportQuery')
const authenticateToken = require('../middleware/authtoken')

//GET all
router.get('/', (req, res) => {
	res.send('API is running')
});

router.get("/:start/:end/:csoport", authenticateToken, cikkCsoport.cikkCsoport)

module.exports = router
