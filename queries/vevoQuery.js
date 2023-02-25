const pool = require('../config/db')

//get vevo date range
exports.vevoRange = async (req, res) => {
	const { start } = req.params
	const { end } = req.params

	try {
		// "?" in query for sanitaze query params
		const query = `SELECT egyseg, COUNT(DISTINCT sorszam) AS vevoszam
						 FROM blokk WHERE datum BETWEEN ? AND ? GROUP BY datum, egyseg`
		
		// [start end] to "?" in query params
		const [rows] = await pool.query(query, [start, end])

		if (!rows[0]) {
			return res.status(404).json({ msg: "Couldn't find data" })
		}
		res.json(rows)
		
	} catch (err) {
		res.status(500).send(err)
	} 
}
