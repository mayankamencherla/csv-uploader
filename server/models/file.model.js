const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FileSchema = new Schema({
    file_id: {type: String, required: true},
    user_id: {type: String, required: true},
});

module.exports = mongoose.model('File', FileSchema);