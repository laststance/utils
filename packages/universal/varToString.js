const varToString = (varObj) => Object.keys(varObj)[0]

const someVar = 42
const displayName = varToString({ someVar })
console.log(displayName)
