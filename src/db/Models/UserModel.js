const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    userId: String,
    email: String,
    token: String
})

module.exports = model('User', UserSchema);