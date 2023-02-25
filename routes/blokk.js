const express = require('express')
const router = express.Router()
const blokk = require('../queries/blokkQuery')
const authenticateToken = require('../middleware/authtoken')

//GET all
router.get('/', (req, res) => {
	res.send('API is running')
});

router.get('/:start-:end', authenticateToken, blokk.blokkRange)

module.exports = router
