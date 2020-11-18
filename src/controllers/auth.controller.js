require('dotenv').config();
const jwt = require('jsonwebtoken');

const UserSchema = require("../models/UserSchema");
const RoleSchema = require("../models/RoleSchema");

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

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser }, process.env.SECRET, {
        expiresIn: 86400 // 24 hours
    });

    res.json({ token });
}

authCtr.signin = async (req, res) => {
    const { celPhone, password } = req.body;

    const userFound = await await UserSchema.findOne({ celPhone: celPhone }).populate('roles');


    if (!userFound) return res.json({ message: 'User not found' });

    const matchPassword = await UserSchema.comparePassword(password, userFound.password);

    if (!matchPassword) return res.json({ token: null, message: 'Invalid password' });

    const token = jwt.sign({ id: userFound }, process.env.SECRET, {
        expiresIn: 86400
    });

    res.json({ token });
}

module.exports = authCtr;