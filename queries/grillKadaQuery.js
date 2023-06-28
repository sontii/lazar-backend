const pool = require('../config/dbKada')

//get cikk date range by csoport
exports.grill = async (req, res) => {
	const { start } = req.params
	const { end } = req.params
	const { egyseg } = req.params
	const { csoport } = req.params
	const { limit } = req.params
 

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT
						
					LIMIT ?`

		// [start end] to '?' in query params
		const [rows] = await pool.query(query, [start,end])		

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}

		res.json(rows)
	} catch (err) {
		res.status(500).send(err)
	}
}
