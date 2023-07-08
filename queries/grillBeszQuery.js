const pool = require('../config/db')

//get cikk date range by csoport
exports.grillBesz = async (req, res) => {
	const { start } = req.params
	const { end } = req.params
	const { egyseg } = req.params

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT
						lazar.grill_besz.datum AS datum, lazar.grill_besz.ertek AS ertek, lazar.grill_besz.minosito_kod AS minosito, lazar.grill_besz.egyseg AS egyseg
						FROM lazar.grill_besz
						WHERE lazar.grill_besz.datum BETWEEN ? AND ?
						GROUP BY lazar.grill_besz.datum, lazar.grill_besz.ertek, lazar.grill_besz.egyseg, lazar.grill_besz.minosito_kod`

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
