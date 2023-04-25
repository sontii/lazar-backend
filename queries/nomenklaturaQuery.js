const { json } = require('express')
const pool = require('../config/db')

const filteredChild = [
	1370785, 1372164, 1373260, 1373272, 1373273, 1373274, 1373275, 1373276,
	1373277, 1373278, 1373296, 1373299,
]
const mutateRow = []

//get blokkk date range
exports.nomenklatura = async (req, res) => {
	
	try {
		// '?' in query for sanitaze query params
		const query = `SELECT * FROM nomenklatura;`

		const [rows] = await pool.query(query)

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}


		//get each depth childrens
		function getChild(childItem, szint){
			//get child for nodes return children array
			let arr = []
			rows.filter(row => row.szint === szint).map(inRow => {
				if (childItem.kod === inRow.kod.substring(0, childItem.kod.length)) {
					arr.push(inRow)
				}
			})
			return arr
		}

		//loop trough each depth and call getChild
		function mutateData() {

			rows
				.filter((row) => row.szint === 1 && !filteredChild.includes(row.id))
				.map((inRow) => {
					mutateRow.push(inRow)
				})

			
			//get second depth childrens
			mutateRow.map(secondChild => {
				secondChild['children'] = getChild(secondChild, 2)
				//get third depth childrens
				secondChild.children.map(thirdChild => {
					thirdChild["children"] = getChild(thirdChild, 3)
					//get fourth depth childrens
					thirdChild.children.map((fourthChild) => {
						fourthChild["children"] = getChild(fourthChild, 4)
						//get fifth depth childrens
						fourthChild.children.map((fifthChild) => {
							fifthChild["children"] = getChild(fifthChild, 5)
						})
					})
				})
			})
		}

		mutateData()

		res.json(mutateRow)
	} catch (err) {
		res.status(500).send(err)
	}
}
