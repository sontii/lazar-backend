require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const router = express.Router();
const mysql = require("mysql2/promise");

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE})

app.use(express.json());

app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get("/", async (req, res) => {
    res.json({ status: "API server is running and ready to serv" });
});

const blokkRouter = require("./routes/blokk.route")
app.use("/blokk", blokkRouter);

app.get("/api/:id", async (req, res) => {
	const { id } = req.params;
	const query = `SELECT * FROM blokk WHERE id=?`;
	const [rows] = await (await connection).query(query, [id]);
	if (!rows[0]) {
		return res.json({ msg: "Couldn't find data" });
	}
	res.json(rows);
});


app.listen(port, () => console.log(`API server listening on ${port}`));
