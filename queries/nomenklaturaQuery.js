const { json } = require('express')
const pool = require('../config/db')

//get blokkk date range
exports.nomenklatura = async (req, res) => {
	
	try {
		// '?' in query for sanitaze query params
		const query = `SELECT * FROM nomenklatura LIMIT 50;`

		const [rows] = await pool.query(query)

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}

		const mutateRow = []
		mutateRow.push({
			name: "",
			children: [1372174, 1372175, 1372176],
			id: 0,
			parent: ""
		})

		rows.map((row) => {
			
				let parentId = 0
				let childrenArray = []
				
				rows.map(inRow => {
					if(row.kod.substring(0, row.kod.length -2) === inRow.kod){
						parentId = inRow.id
					}
					if(inRow.szint === row.szint + 1){
						if(inRow.kod.substring(0, row.kod.length) === row.kod){
							childrenArray.push(inRow.id)
						}
					}
				})

				mutateRow.push({ name: row.nev, children: childrenArray, id: row.id, parent: parentId })
			}
		)

	

		res.json(mutateRow)
	} catch (err) {
		res.status(500).send(err)
	}
}
