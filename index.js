require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:  ', req.path);
    console.log('Body:  ', req.body);
    console.log('---');
    next();
};

app.use(requestLogger);

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({ error: 'Name or number missing' });
    }
    const person = new Person({ name, number });
    person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;
    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
      .then(result => {
          console.log(`Deleted person with id: ${id}`);
          res.status(204).end();
      })
      .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Something went wrong while deleting the person' });
      });
});

app.use((req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

