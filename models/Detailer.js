const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// User Schema
const DetailerSchema = mongoose.Schema({
    detailer_name: {
        type: String,
        required: true
    },
    detailer_email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    detailer_username: {
        type: String,
        unique: true,
        required: true
    },
    detailer_password: {
        type: String,
        required: true
    },
    detailer_contact: {
        type: String,
        required: true
    },
    detailer_job_profile:{
        type: String,
        required: true
    }
});

DetailerSchema.plugin(uniqueValidator);

const Detailer = module.exports = mongoose.model('Detailer', DetailerSchema);

// Find the user by ID
module.exports.getDetailerById = function (id, callback) {
    Detailer.findById(id, callback);
}

// Find the user by Its username
module.exports.getDetailerByUsername = function (detailer_username, callback) {
    const query = {
        detailer_username: detailer_username
    }
    Detailer.findOne(query, callback);
}

// to Register the user
module.exports.addDetailer = function (newDetailer, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newDetailer.detailer_password, salt, (err, hash) => {
            if (err) throw err;
            newDetailer.detailer_password = hash;
            newDetailer.save(callback);
        });
    });
}

// Compare Password
module.exports.comparePassword = function (detailer_password, hash, callback) {
    bcrypt.compare(detailer_password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}