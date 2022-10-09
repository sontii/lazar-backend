const mysql = require("mysql2");
const pool = mysql.createPool({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

exports.findOne = (req, res) => {
	console.log("run");
	const id = req.params.id;
	pool.query(
		"SELECT id, arukod_id FROM `blokk` WHERE `id` = ? ",
		[id],
		function (err, rows, fields) {
			res.json({rows}); //is automatically released when query resolves
		}
	);
};
