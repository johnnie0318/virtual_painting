const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {type: String, default: ''},
    id: {type: String, default: ''},
    type: {type: String, default: 'colors'},
    src: {type: String, default: ''},
    subtype: {type: String, default: '1'}
});

module.exports = mongoose.model('ProductInfos', productSchema)