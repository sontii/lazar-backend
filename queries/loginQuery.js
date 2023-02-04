const bcrypt = require("bcrypt")
const config = require("../config/auth.config")
const jwt = require("jsonwebtoken")
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
	const postData = req.body
	const user = {
		email: postData.email,
		password: postData.password
	}

	try {
		// "?" in query for sanitaze query params
		const query = `SELECT user, password FROM users WHERE user = ?`
		const [queryResult] = await (await connection).query(query, [user.email])
		// [param?] to "?" in query params


		//if no user
		if (!queryResult[0]) {
			return res.status(404).json({ msg: "Cannot find user" })
		}
		
		//compare hashed password
		try{
			if(await bcrypt.compare(user.password, queryResult[0].password)){

				const token = jwt.sign(user, config.accesTokenSecret, {
					expiresIn: config.jwtExpiration,
				})

				const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
					expiresIn: config.jwtRefreshExpiration,
				})


				res.status(201).send({
					email: req.body.user,
					accessToken: token,
					refreshToken: refreshToken,
				})
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
