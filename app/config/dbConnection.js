const mongoose = require('mongoose');

//Database Connection

// const url = 'mongodb://192.168.114.92:8003/virtual-painting';
// const url = 'mongodb://localhost:8003/virtual-painting';
// const url = 'mongodb+srv://admin:%21QAZxsw2@puzzle.am9gf.mongodb.net/Puzzle_number_word?authSource=admin&replicaSet=atlas-h19s4z-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const url = 'mongodb+srv://admin:%21QAZxsw2@mycluster.elpoj.mongodb.net/visualizer?retryWrites=true&w=majority';
try {
    mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true });
} catch (e) {
    console.log('Database could not connect.');
    process.exit(0);
}

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected..');
}).catch(err => {
    console.log('Connection failed..');
})


module.exports = connection;