const pool = require('../config/db')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//get blokkk date range
exports.cikkCsoport = async (req, res) => {
	const { start } = req.params
	const { end } = req.params

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT * FROM cikk JOIN cikk_csoport ON cikk.arukod=cikk_csoport.arukod_id JOIN nomenklatura ON cikk_csoport.nomen_id=nomenklatura.id WHERE arukod = 3509677`

		// [start end] to '?' in query params
		const [rows] = await pool.query(query, [start, end])

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}
		res.json(rows)
	} catch (err) {
		res.status(500).send(err)
	}
}
