const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// Admin Schema
const SubadminSchema = mongoose.Schema({
    subadmin_name: {
        type: String,
        required: true
    },
    subadmin_email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    subadmin_username: {
        type: String,
        unique: true,
        required: true
    },
    subadmin_password: {
        type: String,
        required: true
    },
    subadmin_contact: {
        type: String,
        required: true
    },
    subadmin_job_profile: {
        type: String,
        required: true
    }
});

SubadminSchema.plugin(uniqueValidator);

const Subadmin = module.exports = mongoose.model('Subadmin', SubadminSchema);

// Find the Admin by ID
module.exports.getSubadminById = function (id, callback) {
    Subadmin.findById(id, callback);
}

// Find the Admin by Its username
module.exports.getSubadminByUsername = function (subadmin_username, callback) {
    const query = {
        subadmin_username: subadmin_username
    }
    Subadmin.findOne(query, callback);
}

// to Register the Admin
module.exports.addSubadmin = function (newSubadmin, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newSubadmin.subadmin_password, salt, (err, hash) => {
            if (err) throw err;
            newSubadmin.subadmin_password = hash;
            newSubadmin.save(callback);
        });
    });
}

// Compare Password
module.exports.comparePassword = function (subadmin_password, hash, callback) {
    bcrypt.compare(subadmin_password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}