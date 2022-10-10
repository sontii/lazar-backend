require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const router = express.Router();


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

var datetime = new Date();
console.log(datetime);

app.listen(port, () => console.log(`API server listening on ${port}`));
