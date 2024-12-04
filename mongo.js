const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Agrega el password como argumento');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://Humberto:${password}@cluster0.h8l2w.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name && number) {
    const person = new Person({
        name: name,
        number: number,
    });

    person.save().then(() => {
        console.log(`Añadido ${name} número ${number} a la agenda`);
        mongoose.connection.close();
    });

} else {
    Person.find({}).then(result => {
        console.log('Agenda telefónica:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}
