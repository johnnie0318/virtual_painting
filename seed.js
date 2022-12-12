const mongoose = require('mongoose');
const {getProductList} = require('./app/methods/products');

//Database Connection
// const url = 'mongodb://192.168.104.79:8003/virtual-painting';
// const url = 'mongodb://localhost:8003/virtual-painting';
// const url = 'mongodb+srv://admin:%21QAZxsw2@puzzle.am9gf.mongodb.net/Puzzle_number_word?authSource=admin&replicaSet=atlas-h19s4z-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const url = 'mongodb+srv://admin:%21QAZxsw2@mycluster.elpoj.mongodb.net/visualizer?retryWrites=true&w=majority';


mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected..');
    main();
}).catch(err => {
    console.log('Connection failed..');
})

async function main() {
    // let result = await connection.dropDatabase();
    // console.log('database droped : ', result);
    console.log(await getProductList({filter: 'colors'}));

    await connection.close();
};