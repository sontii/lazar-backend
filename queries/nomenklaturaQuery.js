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

		function getFirstChild(){
			arr= []
			rows.filter(row => row.szint===1).map(inRow => {
				arr.push(inRow)
			})
			return arr

		}

		const mutateRow = {
			name: "Nomenklatúra",
			children: getFirstChild(),
			id: 0,
			szint: 0,
			parent: null,
		}

		function getChild(childArr, szint){
			console.log(childArr)
			let arr = []
				rows.filter(row => row.szint === szint).map(inRow => {
					if (childArr.kod === inRow.kod.substring(0, childArr.kod.length)) {
						arr.push(inRow)
					}
				})
				if(arr.length > 0){
					return arr
				}
		}

		function getAllChild2() {
			let szint = 2
			mutateRow.children.map(secondChild => {
				
				secondChild['children'] = getChild(secondChild, szint)
					szint++
		
				secondChild.children.map(thirdChild => {
					szint++
					thirdChild["children"] = getChild(thirdChild, szint)
							
					thirdArr.map(fourthChild => {
						szint++
						fourthChild["children"] = getChild(fourthChild, szint)
									
						fourthArr.map(fithChild => {
							szint++
							fithChild["children"] = getChild(fithChild, szint)				
						})
					})
				})
			})
		}

		function getAllChild(){
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
									//console.log(thirdChild.kod + " vs " +inRow2.kod.substring(0, thirdChild.kod.length)								)
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
		}		

		getAllChild2()

		/* rows.map((row) => {
			
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
		 */

	

		res.json(mutateRow)
	} catch (err) {
		res.status(500).send(err)
	}
}
