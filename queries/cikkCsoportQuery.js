const pool = require('../config/db')

//get cikk date range by csoport
exports.cikkCsoport = async (req, res) => {
	const { start } = req.params
	const { end } = req.params

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT * FROM blokk
						JOIN cikk ON blokk.arukod_id=cikk.cikk_kod
						JOIN cikk_csoport ON cikk.cikk_id=cikk_csoport.arukod_id
						JOIN nomenklatura ON cikk_csoport.nomen_id=nomenklatura.id
						WHERE blokk.datum BETWEEN "2023-03-01" AND "2023-03-01" AND nomenklatura.kod = 2040401020
						LIMIT 25;`

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
