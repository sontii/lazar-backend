const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

exports.blokkRange = async (req, res) => {
	const { datumtol } = req.params;
	const { datumig } = req.params;
	const query = `SELECT datum, egyseg, SUM(bfogy_ar) FROM blokk WHERE datum BETWEEN ? AND ? GROUP BY datum, egyseg`;
	const [rows] = await (await connection).query(query, [datumtol, datumig]);
	if (!rows[0]) {
		return res.status(404).json({ msg: "Couldn't find data" });
	}
	res.json(rows);
};
