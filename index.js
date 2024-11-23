require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const date = new Date;

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${personsLength} people</p>
        <br/> 
        ${date}   
    `)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savePerson => {
        response.json(savePerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name, 
        number: body.number
    }
   
    Person.findByIdAndUpdate(request.params.id, person, {new:true})
    .then(updatePerson => {
        response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(person => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})