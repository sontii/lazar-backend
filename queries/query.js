const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USRNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	dateStrings: true,
});

exports.blokkRange = async (req, res) => {
	const { start } = req.params;
	const { end } = req.params;
	const query = `SELECT datum, egyseg, sum(bteny_ert), sum(nteny_ert), sum(nyilv_ert) FROM blokk WHERE datum BETWEEN ? AND ? GROUP BY datum, egyseg`;
	const [rows] = await (await connection).query(query, [start, end]);
	if (!rows[0]) {
		return res.status(404).json({ msg: "Couldn't find data" });
	}
	res.json(rows);
};

exports.vevoRange = async (req, res) => {
	const { start } = req.params;
	const { end } = req.params;
	const query = `SELECT egyseg, COUNT(DISTINCT sorszam) AS vevoszam FROM blokk WHERE datum BETWEEN ? AND ? GROUP BY datum, egyseg`;
	const [rows] = await (await connection).query(query, [start, end]);
	if (!rows[0]) {
		return res.status(404).json({ msg: "Couldn't find data" });
	}
	res.json(rows);
};
