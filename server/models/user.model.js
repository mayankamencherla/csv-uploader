const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userModel = new Schema({
    created_at: {type: Number, required: true},
});

module.exports = mongoose.model('User', userModel);