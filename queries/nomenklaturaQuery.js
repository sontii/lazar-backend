const { json } = require('express')
const pool = require('../config/db')

//get blokkk date range
exports.nomenklatura = async (req, res) => {
	
	try {
		// '?' in query for sanitaze query params
		const query = `SELECT id AS id2, kod, nev, szint FROM nomenklatura;`

		const [rows] = await pool.query(query)

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}

		const mutateRow = []
		mutateRow.push({
			name: "",
			children: [
				{ name: "Frissáru" },
				{ name: "Szárazáru" },
				{ name: "Non Food" },
			]
		})

		rows.map((row) => {
			if(row.kod === "01"){
				return
			} else if (row.kod === "TALK"){
				return
			} else if(row.kod.substring(0,1) === "7"){
				return
			} else {
				let parentId = 0
				let childrenArray = []
				
				rows.map(inRow => {
					if(row.kod.substring(0, row.kod.length -2) === inRow.kod){
						parentId = inRow.id
					}
					if(inRow.szint === row.szint + 1){
						if(inRow.kod.substring(0, row.kod.length) === row.kod){
							childrenArray.push({name: inRow.nev})
						}
					}
				})

				mutateRow.push({ name: row.nev, children: childrenArray, id: row.id, parent: parentId })
			}
		})

	

		res.json(mutateRow)
	} catch (err) {
		res.status(500).send(err)
	}
}
