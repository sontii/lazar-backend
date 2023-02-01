const bcrypt = require("bcrypt")
const mysql = require("mysql2/promise")
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USRNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	dateStrings: true,
})

//register user to database
exports.register = async (req, res) => {
	
	try{
		//create hashed password from body password
		const hashedPassword = await bcrypt.hash(req.body.password ,10)
		// "?" in query for sanitaze query params
		const query = `INSERT INTO users (user, password) VALUES (?, ?)`
		const [rows] = await (
			await connection
		).query(query, [req.body.user, hashedPassword])
		// [param?, param?] to "?" in query params
		
		res.status(201).send()
	} catch(err) {	
		res.status(500).send(err.message)
	}
}
