require("dotenv").config()
const express = require('express')
const cors = require("cors")
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

app.use(cors())

app.use(express.json())

let refreshTokens = []

app.get("/api", async (req, res) => {
    res.json({ status: "AUTH server is running and ready to serv" })
});


//generate new access token from valid refresh token
app.post("/api/token", (req, res) => {
	const refreshToken = req.body.token
	if (refreshToken == null) return res.sendStatus(401)
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)
		const accessToken = generateAccessToken({ name: user.name })
		res.json({ accessToken: accessToken })
	})
})


app.post("/api/register", async (req, res) => {
	// Authenticate User
	try {
		//create hashed password from body password
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		// "?" in query for sanitaze query params
		const query = `INSERT INTO users (user, password) VALUES (?, ?)`
		const [rows] = await (
			await connection
		).query(query, [req.body.user, hashedPassword])
		// [param?, param?] to "?" in query params

		res.status(201).send()
	} catch (err) {
		res.status(500).send(err.message)
	} 
})

app.post("/api/login", async (req, res) => {
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
			return res.status(404).send({msg: 'Cannot find user'})
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
					email: req.body.email,
					accessToken: accessToken,
					refreshToken: refreshToken,
				})
			} else {
				res.status(404).send("Not allowed")
			}
		} catch(err) {
			res.status(500).send({msg: "Server error"})
		}

	} catch(err) {
		res.status(500).send({msg: "Server error"})
	}

})

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCES_TOKEN_SECRET, {
		expiresIn: process.env.JWT_ACCES_EXPIRATION,
	})
}

app.listen(port)