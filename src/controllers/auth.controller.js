const jwt = require('jsonwebtoken');
const UserSchema = require("../models/UserSchema");
const RoleSchema = require("../models/RoleSchema");
const Nexmo = require('nexmo');
const config = require('../config/config');
const { use } = require('../routes/auth.routes');
const nexmo = new Nexmo({
    apiKey: config.nexmoApiKey,
    apiSecret: config.nexmoSecret
});
const authCtr = {};

authCtr.signup = async (req, res) => {
    const { celPhone, email, password, roles } = req.body;
    const newUser = new UserSchema({
        celPhone,
        email,
        password: await UserSchema.encryptPassword(password)
    });

    if (roles) {
        const foundRoles = await RoleSchema.find({ name: { $in: roles } });
        newUser.roles = foundRoles.map(role => role._id);
    } else {
        const role = await RoleSchema.findOne({ name: 'user' });
        newUser.roles = [role._id];
    }

    nexmo.verify.request({
        number: `+57${celPhone}`,
        brand: 'Vonage',
        code_length: '4'
    }, (err, result) => {
        console.log(err ? err : result);
        res.json({ request_id: result.request_id, userp: newUser });
    });





    //const token = jwt.sign({ id: savedUser }, process.env.SECRET, {
    //   expiresIn: 86400 // 24 hours
    //});
    //console.log(token);
    //res.json({ token });
}

authCtr.verify = async (req, res) => {
    const { code, request_id, userp } = req.body;
    nexmo.verify.check({
        request_id: request_id,
        code: code
    }, async (err, result) => {
        console.log(err ? err : result)
        const user = new UserSchema(userp);
        const savedUser = await user.save();

        const token = jwt.sign({ id: savedUser }, process.env.SECRET, {
           expiresIn: 86400 // 24 hours
        });
        console.log(token);
        res.json({ token });
    });
}

authCtr.signin = async (req, res) => {
    const { celPhone, password } = req.body;

    const userFound =  await UserSchema.findOne({ celPhone: celPhone }).populate('roles');


    if (!userFound) return res.json({ message: 'User not found' });

    const matchPassword = await UserSchema.comparePassword(password, userFound.password);

    if (!matchPassword) return res.json({ token: null, message: 'Invalid password' });

    const token = jwt.sign({ id: userFound }, process.env.SECRET, {
        expiresIn: 86400
    });
    console.log(token);
    res.json({ token });
}

module.exports = authCtr;