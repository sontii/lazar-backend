const pool = require('../config/db')

//get blokkk date range
exports.blokkRange = async (req, res) => {
	const { start } = req.params
	const { end } = req.params

	try {
		// '?' in query for sanitaze query params
		const query = `SELECT *	FROM blokk_summ_view WHERE datum BETWEEN ? AND ?`

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
