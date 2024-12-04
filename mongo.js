const mongoose = require('mongoose');
const Person = require('./models/person');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://Humberto:${password}@cluster0.h8l2w.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

if (name && number) {
    const person = new Person({ name, number });
    person.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(person => console.log(`${person.name} ${person.number}`));
        mongoose.connection.close();
    });
}
