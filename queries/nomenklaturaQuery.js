const { json } = require('express')
const pool = require('../config/db')

//get blokkk date range
exports.nomenklatura = async (req, res) => {
	
	try {
		// '?' in query for sanitaze query params
		const query = `SELECT * FROM nomenklatura;`

		const [rows] = await pool.query(query)

		if (!rows[0]) {
			return res.status(404).json({ msg: `Couldn't find data` })
		}

		const filteredChild = [
			1370785, 1372164, 1373260, 1373272, 1373273, 1373274, 1373275, 1373276,
			1373277, 1373278, 1373296, 1373299,
		]

		function getFirstChild() {
			//create root child
			arr = []
			rows
				.filter((row) => row.szint === 1 && !filteredChild.includes(row.id))
				.map((inRow) => {
					arr.push(inRow)
				})
			return arr
		}

		const mutateRow = {
			nev: "Nomenklatúra",
			children: getFirstChild(),
			id: 0,
			szint: 0,
			parent: null,
		}

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
		console.log(mutateRow)

		function getAllChild() {
			//get second depth childrens
			mutateRow.children.map(secondChild => {
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

		/* function getAllChild_old(){
			mutateRow.children.map(secondChild => {

				//map second child
				let firstArr = []
				rows.filter(row => row.szint === 2).map(inRow => {
					if (
						secondChild.kod === inRow.kod.substring(0, secondChild.kod.length)
					) {
						firstArr.push(inRow)
					}
				})
				if(firstArr.length > 0){
					secondChild["children"] = firstArr
					//second child end

					//map third child					
					secondChild.children.map((thirdChild) => {
						let thirdArr = []
						rows
							.filter((row2) => row2.szint === 3)
							.map((inRow2) => {
								if (
									thirdChild.kod ===
									inRow2.kod.substring(0, thirdChild.kod.length)
								) {
									thirdArr.push(inRow2)
								}
							})
						if (thirdArr.length > 0) {
							thirdChild["children"] = thirdArr
							//third child end

							//fourth begin
							thirdArr.map((fourthChild) => {
								let fourthArr = []
								rows
									.filter((row3) => row3.szint === 4)
									.map((inRow3) => {
										if (
											fourthChild.kod ===
											inRow3.kod.substring(0, fourthChild.kod.length)
										) {
											fourthArr.push(inRow3)
										}
									})
								if (fourthArr.length > 0) {
									fourthChild["children"] = fourthArr
									//fourth child end

									//fith begin
									fourthArr.map((fithChild) => {
										let fithArr = []
										rows
											.filter((row4) => row4.szint === 5)
											.map((inRow4) => {
												if (
													fithChild.kod ===
													inRow4.kod.substring(0, fithChild.kod.length)
												) {
													fithArr.push(inRow4)
												}
											})
										if (fithArr.length > 0) {
											fithChild["children"] = fithArr
											//fith child end
										}
									})
								}
							})
						}
					})

				}
			})
		}		 */

		getAllChild()

		res.json(mutateRow)
	} catch (err) {
		res.status(500).send(err)
	}
}
