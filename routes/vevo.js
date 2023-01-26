const express = require("express");
const vevo = require("../queries/vevoQuery");
const router = express.Router();

//GET all
router.get("/", (req, res) => {
	res.send("API is running");
});

router.get("/:start-:end", vevo.vevoRange);

module.exports = router;
