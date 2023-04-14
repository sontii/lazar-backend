const pool = require('../config/db')

//get blokkk date range
exports.nomenklatura = async (req, res) => {
	
	try {
		// '?' in query for sanitaze query params
		const query = `SELECT * FROM nomenklatura;`

		const [rows] = await pool.query(query)

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}
		res.json(rows)
	} catch (err) {
		res.status(500).send(err)
	}
}
