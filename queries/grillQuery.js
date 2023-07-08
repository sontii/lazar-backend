const pool = require('../config/db')

//get cikk date range by csoport
exports.grill = async (req, res) => {
	const { start } = req.params
	const { end } = req.params
	const { egyseg } = req.params

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT
						lazar.blokk.datum AS datum, sum(lazar.blokk.menny) AS menniseg, sum(lazar.blokk.nteny_ert) AS netto, sum(lazar.blokk.bteny_ert) AS brutto, lazar.blokk.egyseg AS egyseg
						FROM lazar.blokk
						JOIN lazar.cikk ON lazar.cikk.cikk_kod = lazar.blokk.arukod_id
						WHERE lazar.blokk.datum BETWEEN ? AND ? AND
							(lazar.cikk.rovid_nev LIKE "NP-%" OR
							lazar.cikk.rovid_nev LIKE "Np-%" OR
							lazar.cikk.rovid_nev LIKE "nP-%" OR
							lazar.cikk.rovid_nev LIKE 'np-%' OR
							lazar.cikk.rovid_nev LIKE 'K-%' OR
							lazar.cikk.rovid_nev LIKE 'k-%') AND
							lazar.blokk.arukod_id NOT IN(
													8000462000,
													8000457000,
													8000456000,
													8000455000,
													8000454000,
													8000453000,
													8000452000,
													8000389000,
													7001546000,
													7001540000,
													6071355000,
													4806737000,
													4806736000,
													4806735000,
													4806720000,
													4806719000,
													4806717000,
													4806716000,
													4806715000,
													4806714000,
													4806713000,
													4806712000,
													4806711000,
													4806710000,
													4806709000,
													4806707000,
													4806706000,
													4806705000,
													4806704000,
													4806703000,
													4806702000,
													4806701000,
													4806700000,
													4806699000,
													4806697000,
													4806696000,
													4806695000,
													4806694000,
													4806693000,
													6906442816
													)
									GROUP BY lazar.blokk.datum, lazar.blokk.egyseg
									`

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
