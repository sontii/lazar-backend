require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.API_PORT
//const router = express.Router();

app.use(express.json())

app.get("/api", async (req, res) => {
    res.json({ status: "API server is running and ready to serv" })
})

const blokkRouter = require('./routes/blokk')
app.use("/api/blokk", blokkRouter)

const vevoRouter = require('./routes/vevo')
app.use("/api/vevo", vevoRouter)

const registerRouter = require('./routes/register')
app.use("/api/register", registerRouter)

/* const loginRouter = require('./routes/login')
app.use("/api/login", loginRouter) */

app.listen(port, () => console.log(`API server listening on ${port}`))