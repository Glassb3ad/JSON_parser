class JSONparser {
    constructor () {}

    toJSON = (input) => {
        if(typeof(input) === 'object'){
            if(Array.isArray(input)){
                let result = "["
                for (let i = 0; i < input.length; i++){
                    if(typeof(input[i]) === 'string') {
                        result = result + '"' + input[i] + '"'
                    }
                    if(typeof(input[i]) === 'object'){    
                        result = result + this.toJSON(input[i])
                    }
                    else {
                        result = result + input[i]
                    }
                    if(i != input.length-1){
                        result = result + ', '
                    }
                }
                return (result + ']')
            }
            else {
                let result ="{ "
                const properties = Object.keys(input) 
                for(let i = 0; i < properties.length; i++){
                    result = result + '"' + properties[i] + '"' + ': '
                    if(typeof(input[properties[i]]) === 'string') {
                        result = result + '"' + input[properties[i]] + '"'
                    }
                    else if(typeof(input[properties[i]]) === 'object'){    
                        result = result + this.toJSON(input[properties[i]])
                        //console.log(typeof(input[properties[i]]))
                    }
                    else {
                        result = result + input[properties[i]]
                    }
                    if(i != properties.length - 1){
                        result = result + ', '                        
                    }

                }
                return (result + ' } ')
            }    
        }
        else{
            return null
        }
    }

    fromJSON = (str) => {
        const heap = []
        if(str[0] === '{'){
            heap.push('{')
            return (this.fromJSONHelper (str.slice(1), heap))[0]
        }
        if(str[0] === '['){
            return (this.fromJSONHelper (str.slice(1), heap.push('[')))[0]
        }
        throw new Error("Not JSON")
    }
    fromJSONHelper (str, heap) {
        if(heap[heap.length - 1] === '{'){
            const entity = {}
            let name = ""
            let value = ""
            let isValue = false
            let isString = false
            const addChar = (a) => {
                if (isValue) value += a
                else name += a
            }
            const addProperty = () => {
                if(!isValue) throw new Error("Not JSON") 
                entity[name.slice(1,name.length-1)] = getValue(value)
                name = ""
                value = ""
                isValue = false
            }

            let i = 0
            for(i = 0; i < str.length; i++){
                /*
                console.log(heap)
                console.log("String: " + str.slice(i))
                console.log("isValue: " + isValue )
                console.log("isString: " + isString )
                console.log("Name: " + name )
                console.log("value: " + value )
                console.log("i: " + i)
                */
                if(isString){
                    //for now, lets not worry about escaping " marks
                    if(str[i] === '"'){
                        addChar('"')
                        isString = false
                    }
                    else {
                        addChar(str[i])
                    }
                }
                else{
                    if(str[i].search(/\s/) != -1){
                        //console.log("Whitespace found!")
                        continue
                    }
                    if(str[i] === ':') {
                        isValue = true
                        continue
                    }
                    if(str[i] === '}') {
                        addProperty()
                        break
                    }
                    if(str[i] === ']') throw new Error("Not JSON")
                    if(str[i] === '{' || str[i] === '['){
                        if(!isValue) throw new Error("Not JSON")
                        const result = this.fromJSONHelper(str.slice(i+1), heap.concat(str[i]))
                        i = i+result[1]
                        value = result[0]
                        continue
                    }
                    if(str[i] === ','){
                        addProperty()
                        continue
                    }
                    if(str[i] === '"'){
                        addChar(str[i])
                        isString = true
                        continue
                    }
                    addChar(str[i])
                }   
            }
            //console.log([entity, i+1])
            return [entity, i+1]
        }
        if(heap[heap.length - 1] === '['){    
        }
    }
}

const getValue = (s) => {
    if (typeof(s) === 'object') return s
    if (s[0] === '"' && s[s.length-1] === '"') return s.slice(1,s.length-1)
    if (s === 'true') return true
    if (s === 'false') return false
    if (! Number.isNaN(Number(s))) return Number.parseFloat(s)
    throw new Error(s + " is not in a correct format to be JSON") 
}

const JSONConverter = new JSONparser
module.exports = JSONConverter
