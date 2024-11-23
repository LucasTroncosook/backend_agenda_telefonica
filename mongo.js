const mongoose = require('mongoose');

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

console.log(process.argv[3], process.argv[4])

const password = process.argv[2];

const url = `mongodb+srv://agenda-telefonica:${password}@cluster0.6gjfx.mongodb.net/persons?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false)

mongoose.connect(url);

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3]
const number = process.argv[4]

if(name !== undefined && number !== undefined){
    const person = new Person({
        name,
        number
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}else{
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

