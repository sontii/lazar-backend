const express = require('express')
const router = express.Router()
const grillNp = require('../queries/grillNpQuery')
const authenticateToken = require('../middleware/authtoken')

//GET all
router.get('/', (req, res) => {
	res.send('API is running')
});

router.get("/:start/:end/:egyseg", /* authenticateToken, */ grillNp.grillNp)

module.exports = router
