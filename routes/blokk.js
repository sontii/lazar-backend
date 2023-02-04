const express = require("express")
const blokk = require("../queries/blokkQuery")
const router = express.Router()

//GET all
router.get("/", (req, res) => {
	res.send("API is running")
});

router.get("/:start-:end", blokk.blokkRange)

module.exports = router
