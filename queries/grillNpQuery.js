const pool = require('../config/db')

//get cikk date range by csoport
exports.grillNp = async (req, res) => {
	const { start } = req.params
	const { end } = req.params
	const { egyseg } = req.params

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT
						sum(lazar.blokk.menny), sum(lazar.blokk.nteny_ert), sum(lazar.blokk.bteny_ert)
						FROM lazar.blokk
						JOIN lazar.cikk ON lazar.cikk.cikk_kod = lazar.blokk.arukod_id
						WHERE lazar.blokk.datum BETWEEN ? AND ? AND
							lazar.blokk.egyseg = ? AND
							(lazar.cikk.rovid_nev LIKE "NP-%" OR
							lazar.cikk.rovid_nev LIKE "Np-%" OR
							lazar.cikk.rovid_nev LIKE 'np-%')`

		// [start end] to '?' in query params
		const [rows] = await pool.query(query, [start,end, egyseg])		

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}

		res.json(rows)
	} catch (err) {
		res.status(500).send(err)
	}
}
