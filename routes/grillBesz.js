const express = require('express')
const router = express.Router()
const grillBesz = require('../queries/grillBeszQuery')
const authenticateToken = require('../middleware/authtoken')

//GET all
router.get('/', (req, res) => {
	res.send('API is running')
});

router.get("/:start/:end", authenticateToken, grillBesz.grillBesz)

module.exports = router
