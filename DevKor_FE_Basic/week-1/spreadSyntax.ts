const arr1 = [1, 2, 3]
const arr2 = [...arr1]
const arr3 = arr1
const arr4 = [...arr1, 4, 5]

arr1 === arr2
//info: false

arr1 === arr3
//info: true

const obj1 = { a: 1, b: 2 }

const obj2 = { c: 3, d: 4 }

const obj3 = { ...obj1, ...obj2 }
//info: {a: 1, b: 2, c: 3, d: 4}

const obj5 = { ...obj1, a: 10 }

const a = 1
const b = 2
const obj = { a, b }

//info: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax
