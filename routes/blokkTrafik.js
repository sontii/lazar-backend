const express = require('express')
const router = express.Router()
const blokkTrafik = require('../queries/blokkTrafikQuery')
const authenticateToken = require('../middleware/authtoken')

//GET all
router.get('/', (req, res) => {
	res.send('API is running')
});

router.get('/:start/:end', authenticateToken, blokkTrafik.blokkRange)

module.exports = router
