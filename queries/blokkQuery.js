const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USRNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	dateStrings: true,
});


//get blokkk date range
exports.blokkRange = async (req, res) => {
	const { start } = req.params;
	const { end } = req.params;

	try{

		// "?" in query for sanitaze query params
		const query = `SELECT datum, egyseg, sum(bteny_ert), sum(nteny_ert) - sum(nyilv_ert) AS arres, (sum(nteny_ert) - sum(nyilv_ert))* 100 / sum(nteny_ert) AS arresSzazalek FROM blokk WHERE datum BETWEEN ? AND ? GROUP BY datum, egyseg`

		// [start end] to "?" in query params
		const [rows] = await (await connection).query(query, [start, end])
		if (!rows[0]) {
			return res.status(404).json({ msg: "Couldn't find data" })
		}
		res.json(rows)

	} catch (err){
		res.status(500).send(err)
	} 
	
};