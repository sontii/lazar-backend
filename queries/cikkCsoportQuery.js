const pool = require('../config/db')

//get cikk date range by csoport
exports.cikkCsoport = async (req, res) => {
	const { start } = req.params
	const { end } = req.params
	const { egyseg } = req.params
	const { csoport } = req.params
	const { limit } = req.params
 

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT
						lazar.blokk.egyseg AS egyseg,
						lazar.blokk.arukod_id AS arukod,
						ROUND(sum(lazar.blokk.bteny_ert)) AS fogyar,
						ROUND(sum(lazar.blokk.nteny_ert - lazar.blokk.nyilv_ert)) AS arres,
						ROUND(sum(lazar.blokk.menny), 2) AS mennyiseg,
						lazar.cikk.rovid_nev AS cikk_nev,
						lazar.nomenklatura.nev AS nomemklatura,
						lazar.nomenklatura.kod AS nomemklatura_kod
					FROM blokk
					JOIN lazar.cikk ON lazar.blokk.arukod_id = lazar.cikk.cikk_kod
					JOIN lazar.cikk_csoport ON lazar.cikk.cikk_id = lazar.cikk_csoport.arukod_id
					JOIN lazar.nomenklatura ON lazar.cikk_csoport.nomen_id = lazar.nomenklatura.id
					WHERE datum BETWEEN ? AND ? AND lazar.nomenklatura.kod LIKE ? AND egyseg = ?
					GROUP BY arukod, egyseg, cikk_nev, nomemklatura, nomemklatura_kod
					ORDER BY mennyiseg DESC
					LIMIT ? `

		// [start end] to '?' in query params
		const [rows] = await pool.query(query, [
			start,
			end,
			csoport + '%',
			egyseg,
			parseInt(limit),
		])		

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}

		res.json(rows)
	} catch (err) {
		res.status(500).send(err)
	}
}
