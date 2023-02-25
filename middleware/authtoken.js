const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]
	if (token == null) return res.sendStatus(401)

	jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) => {
		console.log(err)
		if (err) return res.sendStatus(403).json({msg: err})
		req.user = user
		next()
	})
}

module.exports = authenticateToken