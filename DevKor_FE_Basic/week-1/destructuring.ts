const array = [1, 2, 3, 4, 5]
const [first, second, ...rest] = array

//info: first = 1, second = 2, rest = [3, 4, 5]

const array_ = [1, 2]
const [a = 10, b = 20, c = 30] = array_
//info: a = 1, b = 2, c = 30

const user = { userName: 'devkor', age: 24, department: 'computer science', graduation: 2026 }
const { userName, age, ...userInfo } = user
/*
 info: userName = 'devkor', age = 24, 
 info: userInfo = {department: 'computer science', graduation: 2026}
*/
const { userName: id, age: userAge, ...restInfo } = user

// info: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
