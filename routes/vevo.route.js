const express = require("express");
const blokk = require("../queries/blokk");
const router = express.Router();

//GET all
router.get("/", (req, res) => {
	res.send("API is running");
});

router.get("/:datumtol/:datumig", blokk.vevoRange);

module.exports = router;
