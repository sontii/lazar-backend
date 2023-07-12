const pool = require('../config/db')

//get cikk date range by csoport
exports.logisztika = async (req, res) => {
	const { start } = req.params
	const { end } = req.params
	const { egyseg } = req.params

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT
						datum,
						ROUND(brutto_fogy, 0),
						ROUND(netto_fogy, 0),
						ROUND(netto_nyilv, 0),
						ROUND(vevo, 0)
						FROM lazar.logisztika
						WHERE lazar.logisztika.datum BETWEEN ? AND ?`

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
