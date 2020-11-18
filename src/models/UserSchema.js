const { Schema, model} = require('mongoose');
const ObjectId = require('mongoose').Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    celPhone: {type: Number, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    names: {type: String},
    lastNames: {type: String},
    cc: {type: Number, unique: true},
    password: {type: String, required: true},
    roles: [{ ref: "role", type: ObjectId}]
}, {versionKey: false, timestamps: true});

UserSchema.statics.encryptPassword = async (password) => {
   const salt = await bcrypt.genSalt(10);
   return bcrypt.hash(password, salt);
};
UserSchema.statics.comparePassword = async (password, receivedPassword) => {
    return bcrypt.compare(password, receivedPassword);
};

module.exports = model('user', UserSchema);