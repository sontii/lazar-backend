require("dotenv").config()
const express = require('express')
const app = express()
const port = process.env.PORT
//const router = express.Router();

app.use(json())

app.get("/api", async (req, res) => {
    res.json({ status: "API server is running and ready to serv" })
})

import blokkRouter from "./routes/blokk"
app.use("/api/blokk", blokkRouter)

import vevoRouter from "./routes/vevo"
app.use("/api/vevo", vevoRouter)

import loginRouter from "./routes/login"
app.use("/api/login", loginRouter)

import registerRouter from "./routes/register"
app.use("/api/register", registerRouter)

app.listen(port, () => console.log(`API server listening on ${port}`))