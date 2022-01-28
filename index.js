class JSONparser {
    constructor () {}
//---------------------------------------------------------------------------------------------------------------------------
//This function takes javascript objects and turns them into proper JSON representations.    
    toJSON = (input) => {
        if(typeof(input) === 'object'){
            if(Array.isArray(input)){
                let result = "["
                for (let i = 0; i < input.length; i++){
                    if(typeof(input[i]) === 'string') {
                        result = result + '"' + input[i] + '"'
                    }
                    else {
                        if(typeof(input[i]) === 'object'){    
                            result = result + this.toJSON(input[i])
                        }
                        else {
                            result = result + input[i]
                        }
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

//----------------------------------------------------------------------------------------------------------------------------------------------    
    //This function appears to convert proper JSON string into javascript object...
    fromJSON = (str) => {
        if(str[0] === '{'){
            return (this.fromJSONHelper (str.slice(1), '{'))[0]
        }
        if(str[0] === '['){
            return (this.fromJSONHelper (str.slice(1), '['))[0]
        }
        throw new Error("Not JSON")
    }

    //... but this function does all the work
    fromJSONHelper (str, char) {
        //This function operates recursively and divides into two cases "object case" and "Array case". The case is defined by argument char. 
        //Depending on the case, function returns either an object or an array. If given String is not proper JSON, function throws an error.
        //helpfull variables used to gather values or to remember states of the parsing progress -->
        let name = ""
        let value = ""
        let isValue = false
        let isString = false
        //Helper functions -->
        const addChar = (a) => {
            if (isValue) value += a
            else name += a
        }
        const buildString = (x) => {
            //for now, lets not worry about escaping " marks
            if(x === '"'){
                addChar('"')
                isString = false
            }
            else {
                addChar(x)
            }
        }        
        //Object case
        if(char === '{'){
            //return value ->
            const entity = {}
            //function adds new properties to entity
            const addProperty = () => {
                if(!isValue) throw new Error("Not JSON") 
                entity[name.slice(1,name.length-1)] = getValue(value)
                name = ""
                value = ""
                isValue = false
            }
            //Code that runs the parsing process -->
            let i = 0
            for(i = 0; i < str.length; i++){
                /*
                console.log("String: " + str.slice(i))
                console.log("isValue: " + isValue )
                console.log("isString: " + isString )
                console.log("Name: " + name )
                console.log("value: " + value )
                console.log("i: " + i)
                */
                if(isString) buildString(str[i])
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
                        const result = this.fromJSONHelper(str.slice(i+1), str[i])
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
        //Array case
        if(char === '['){
            //Return value -->
            const entity = []
            //Function that add new itmes into array
            const addItem = () => {
                entity.push(getValue(value))
                value = ""
            }
            //With arrays there is only values to be coded and no property names -->
            isValue = true 
            //Code that runs the parsing process -->
            let i = 0
            for(i = 0; i < str.length; i++){
                if(isString) buildString(str[i])
                else{
                    //checks if current index contains whispace character and ignores it
                    if(str[i].search(/\s/) != -1){
                        //console.log("Whitespace found!")
                        continue
                    }
                    if(str[i] === ']') {
                        addItem()
                        break
                    }
                    if(str[i] === '}') throw new Error("Not JSON")
                    if(str[i] === '{' || str[i] === '['){
                        const result = this.fromJSONHelper(str.slice(i+1), str[i])
                        i = i+result[1]
                        value = result[0]
                        continue
                    }
                    if(str[i] === ','){
                        addItem()
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
            return [entity, i+1]    
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
