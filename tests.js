const par = require('./index')


const test2 = '{"ankka":"234","possu":12,"kissa":true,"kilpikonna":"karvainen","Emilia":{"Kissa2":100,"Kissa3": {"karvoitus":"tuuhea", "vihainen":true}},"JERE":{"KISSA":23,"KISSAA":34.3}}'
console.log(par.toJSON(test1))
const test2c = par.fromJSON(test2) 
console.log(test2c)
console.log(par.toJSON(test2c))
console.log(par.fromJSON(par.toJSON(test2c)))

