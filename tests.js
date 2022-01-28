const par = require('./index')


const test2 = '{"ankka":"234","possu":12,"kissa":true,"kilpikonna":"karvainen","Emilia":{"Kissa2":100,"Kissa3": {"karvoitus":"tuuhea", "vihainen":true}},"JERE":{"KISSA":23,"KISSAA":34.3}, "taulukko":[234, 12, "KISSA"]}'
const test2c = par.fromJSON(test2) 
console.log(test2c)
console.log(par.toJSON(test2c))
console.log(par.fromJSON(par.toJSON(test2c)))
const test3 = '["ankka","possu","aasi", [1000, 23, 43, true, 123.2345567]]'
const test3res = par.fromJSON(test3) 
console.log(test3res)
console.log(par.toJSON(test3res))


