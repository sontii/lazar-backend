const bcrypt = require("bcrypt")
const mysql = require("mysql2/promise")
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USRNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	dateStrings: true,
})

//Login user send back token
exports.loginPost = async (req, res) => {

	try {
		// "?" in query for sanitaze query params
		const query = `SELECT user, password FROM users WHERE user = ?`
		const [queryResult] = await (await connection).query(query, [req.body.user])
		// [param?] to "?" in query params


		//if no user
		if (!queryResult[0]) {
			return res.status(404).json({ msg: "Cannot find user" })
		}
		
		//compare hashed password
		try{
			if(await bcrypt.compare(req.body.password, queryResult[0].password)){
				res.status(201).send('Succes')
			} else {
				res.status(404).send('Not allowed')
			}
		} catch {
			res.status(500).send()
		}

	} catch(err) {
		res.status(500).send(err.message)
	}
}
