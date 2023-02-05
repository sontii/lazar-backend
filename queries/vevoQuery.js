const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USRNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	dateStrings: true,
});


//get vevo date range
exports.vevoRange = async (req, res) => {
	const { start } = req.params
	const { end } = req.params


	try{
		// "?" in query for sanitaze query params
		const query = `SELECT egyseg, COUNT(DISTINCT sorszam) AS vevoszam FROM blokk WHERE datum BETWEEN ? AND ? GROUP BY datum, egyseg`
		const [rows] = await (await connection).query(query, [start, end])

		// [start end] to "?" in query params
		if (!rows[0]) {
			return res.status(404).json({ msg: "Couldn't find data" })
		}
		res.json(rows)
	} catch (err) {
		res.status(500).send(err)
	}
};
