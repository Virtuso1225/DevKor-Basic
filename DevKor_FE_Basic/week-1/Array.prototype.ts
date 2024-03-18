//info: Array.prototype.map
const array = [1, 2, 3, 4, 5]
const newArray = array.map(item => item + 1)
//? newArray = [2, 3, 4, 5, 6]

//info: Array.prototype.filter
const filteredArray = array.filter(item => item > 3)
//? filteredArray = [4, 5]

//info: Array.prototype.reduce
const reducedArray = array.reduce((acc, cur) => acc + cur, 0)
//? reducedArray = 15

//info: Array.prototype.forEach
array.forEach(item => console.log(item))
