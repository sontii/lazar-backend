const express = require('express')
const router = express.Router()
const grill = require('../queries/grillQuery')
const authenticateToken = require('../middleware/authtoken')

//GET all
router.get('/', (req, res) => {
	res.send('API is running')
});

router.get("/:start/:end/:egyseg", authenticateToken, grill.grill)

module.exports = router
