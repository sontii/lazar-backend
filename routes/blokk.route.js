const express = require("express");
const blokk = require("../queries/query");
const router = express.Router();

//GET all
router.get("/", (req, res) => {
	res.send("API is running");
});

router.get("/:datumtol/:datumig", blokk.blokkRange);


module.exports = router;
