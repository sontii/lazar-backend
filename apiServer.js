require('dotenv').config()
const express = require('express')
const cors = require("cors")
const app = express()
const port = process.env.API_PORT
const blokkRouter = require('./routes/blokk')
const blokkTrafikRouter = require("./routes/blokkTrafik")
const cikkCsoportRouter = require('./routes/cikkCsoport')
const grillRouter = require('./routes/grill')
const logisztikaRouter = require("./routes/logisztika")
const nomenklaturaRouter = require('./routes/nomenklatura')

//const router = express.Router();

app.use(express.json())
app.use(cors())

app.get("/api", async (req, res) => {
    res.json({ status: "API server is running and ready to serv" })
})

app.use("/api/blokk", blokkRouter)
app.use("/api/blokktrafik", blokkTrafikRouter)
app.use("/api/cikkcs", cikkCsoportRouter)
app.use("/api/nomenklatura", nomenklaturaRouter)
app.use("/api/grill", grillRouter)
app.use("/api/logisztika", logisztikaRouter)

app.listen(port, '0.0.0.0')
