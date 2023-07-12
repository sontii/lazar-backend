const express = require('express')
const router = express.Router()
const logisztika = require('../queries/logisztikaQuery')
const authenticateToken = require('../middleware/authtoken')

//GET all
router.get('/', (req, res) => {
	res.send('API is running')
});

router.get("/:start/:end", authenticateToken, logisztika.logisztika)

module.exports = router
