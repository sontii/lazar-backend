const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

exports.findOne = async (req, res) => {
	const { id } = req.params;
	const query = `SELECT * FROM blokk WHERE id=?`;
	const [rows] = await (await connection).query(query, [id]);
	if (!rows[0]) {
		return res.json({ msg: "Couldn't find data" });
	}
	res.json(rows);
};
