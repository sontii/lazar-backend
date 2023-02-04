require("dotenv").config()
const express = require('express')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
const port = process.env.AUTH_PORT
const mysql = require("mysql2/promise")
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USRNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	dateStrings: true,
})

//const router = express.Router();

app.use(express.json())

let refreshTokens = []

app.get("/api/auth", async (req, res) => {
    res.json({ status: "AUTH server is running and ready to serv" })
});

app.post("/token", (req, res) => {
	const refreshToken = req.body.token
	if (refreshToken == null) return res.sendStatus(401)
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)
		const accessToken = generateAccessToken({ name: user.name })
		res.json({ accessToken: accessToken })
	})
})

app.delete("/logout", (req, res) => {
	refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
	res.sendStatus(204)
})

app.post("/login", async (req, res) => {
	// Authenticate User
	const postData = req.body
	const user = {
		email: postData.email,
		password: postData.password,
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

				const accessToken = generateAccessToken(user)

				const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
					expiresIn: process.env.JWT_REFRESH_EXPIRATION,
				})
                refreshTokens.push(refreshToken)


				res.status(201).send({
					email: user.email,
					accessToken: accessToken,
					refreshToken: refreshToken,
				})
			} else {
				res.status(404).send('Not allowed')
			}
		} catch(err) {
			console.log(err)
			res.status(500).send()
		}

	} catch(err) {
		res.status(500).send(err.message)
	}

})

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCES_TOKEN_SECRET, {
		expiresIn: process.env.JWT_ACCES_EXPIRATION,
	})
}

app.listen(port)