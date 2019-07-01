const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// Admin Schema
const ManagerSchema = mongoose.Schema({
    manager_name: {
        type: String,
        required: true
    },
    manager_email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    manager_username: {
        type: String,
        unique: true,
        required: true
    },
    manager_password: {
        type: String,
        required: true
    },
    manager_contact: {
        type: String,
        required: true
    },
    manager_job_profile: {
        type: String,
        required: true
    }
});

ManagerSchema.plugin(uniqueValidator);

const Manager = module.exports = mongoose.model('Manager', ManagerSchema);

// Find the Admin by ID
module.exports.getManagerById = function (id, callback) {
    Manager.findById(id, callback);
}

// Find the Admin by Its username
module.exports.getManagerByUsername = function (manager_username, callback) {
    const query = {
        manager_username: manager_username
    }
    Manager.findOne(query, callback);
}

// to Register the Admin
module.exports.addManager = function (newManager, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newManager.manager_password, salt, (err, hash) => {
            if (err) throw err;
            newManager.manager_password = hash;
            newManager.save(callback);
        });
    });
}

// Compare Password
module.exports.comparePassword = function (manager_password, hash, callback) {
    bcrypt.compare(manager_password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}