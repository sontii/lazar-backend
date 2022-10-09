const express = require("express");
const blokk = require("../queries/blokk");
const router = express.Router();

//GET all
router.get("/", (req, res) => {
	res.send("Hello W");
});

router.get("/:id", blokk.findOne);

module.exports = router;
