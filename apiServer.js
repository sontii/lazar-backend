require('dotenv').config()
const express = require('express')
const cors = require("cors")
const jwt = require("jsonwebtoken")
const app = express()
const port = process.env.API_PORT
const blokkRouter = require('./routes/blokk')
const vevoRouter = require('./routes/vevo')

//const router = express.Router();

app.use(express.json())
app.use(cors())

app.get("/api", async (req, res) => {
    res.json({ status: "API server is running and ready to serv" })
})

app.use("/api/blokk", blokkRouter)

app.use("/api/vevo", vevoRouter)

app.listen(port, '0.0.0.0')