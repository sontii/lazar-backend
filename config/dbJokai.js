const mysql = require("mysql2/promise")

module.exports = mysql.createPool({
	host: process.env.HOST_JOKAI,
	user: process.env.USRNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	dateStrings: true,
	connectionLimit: 10,
	waitForConnections: true,
	queueLimit: 0,
})