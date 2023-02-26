require("dotenv").config()
const express = require('express')
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
const port = process.env.AUTH_PORT

const pool = require("./config/db")

app.use(cors())

app.use(express.json())


app.get("/api", async (req, res) => {
    res.json({ status: "AUTH server is running and ready to serv" })
});


//generate new access token from valid refresh token
app.post("/api/auth/token", (req, res) => {
	const refreshToken = req.body.token
	if (refreshToken == null) return res.sendStatus(401)
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)
		const accessToken = generateAccessToken({ user: req.body.email })
		res.json({ accessToken: accessToken })
	})
})


app.post("/api/auth/register", async (req, res) => {
	//check if user already exist
	try {
		// "?" in query for sanitaze query params
		const query = `SELECT user FROM users WHERE user = ?`
		const [queryResult] = await pool.query(query, [req.body.email])
		// [param?] to "?" in query params

		//if no user
		if (queryResult[0]) {
			return res.status(403).send({ msg: "Already exist" })
		}

	} catch (err) {
		res.status(500).send({ msg: "Server error" })
	}

	// Register User
	try {
		//create hashed password from body password
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		// "?" in query for sanitaze query params
		const query = `INSERT INTO users (user, password) VALUES (?, ?)`
		const [rows] = await pool.query(query, [req.body.email, hashedPassword])
		// [param?, param?] to "?" in query params

		res.status(201).send()
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.post("/api/auth/login", async (req, res) => {
	// Authenticate User
	const postData = req.body
	

	try {
		// "?" in query for sanitaze query params
		const query = `SELECT user, password, isadmin FROM users WHERE user = ?`
		const [queryResult] = await pool.query(query, [user.email])
		// [param?] to "?" in query params

		//if no user
		if (!queryResult[0]) {
			return res.status(404).send({ msg: "Cannot find user" })
		}

		const user = {
			email: postData.email,
			isAdmin: queryResult[0].isadmin,
		}

		try {
			//compare hashed password
			if (await bcrypt.compare(user.password, queryResult[0].password)) {
				const accessToken = generateAccessToken(user)

				const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
					expiresIn: process.env.JWT_REFRESH_EXPIRATION,
				})

				res.status(201).send({
					accessToken: accessToken,
					refreshToken: refreshToken,
				})
			} else {
				res.status(404).send("Not allowed")
			}
		} catch (err) {
			console.log(err)
			res.status(500).send({ msg: "Server error" })
		}
	} catch (err) {
		res.status(500).send({ msg: "Server error" })
	}
})

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCES_TOKEN_SECRET,
		{
		expiresIn: process.env.JWT_ACCES_EXPIRATION
	})
}

app.listen(port, '0.0.0.0')