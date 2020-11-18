const RoleSchema = require('../models/RoleSchema');

const createRoles = async () =>{
    try {
        const count = await RoleSchema.estimatedDocumentCount();

        if (count > 0) return;
    
        const values = await Promise.all([
            new RoleSchema({name: 'user'}).save(),
            new RoleSchema({name: 'admin'}).save(),
            new RoleSchema({name: 'driver'}).save()
        ]);

        console.log(values);

    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    createRoles
};