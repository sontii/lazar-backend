const pool = require('../config/db')

//get blokkk date range
exports.blokkRange = async (req, res) => {
	const { start } = req.params
	const { end } = req.params

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT DATE_FORMAT(datum, "%Y.%m.%d") AS datum, egyseg, FORMAT(sum(bteny_ert), 0) AS fogyar, FORMAT(sum(nteny_ert) - sum(nyilv_ert), 0) AS arres, FORMAT((sum(nteny_ert) - 
						sum(nyilv_ert))* 100 / sum(nteny_ert), 0) AS arresSzazalek 
						FROM blokk WHERE datum BETWEEN ? AND ? GROUP BY datum, egyseg`

		// [start end] to '?' in query params
		const [rows] = await pool.query(query, [start, end])

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}
		res.json(rows)
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
}
