const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// telecaller Schema
const TelecallerSchema = mongoose.Schema({
    telecaller_name: {
        type: String,
        required: true
    },
    telecaller_email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    telecaller_username: {
        type: String,
        unique: true,
        required: true
    },
    telecaller_password: {
        type: String,
        required: true
    },
    telecaller_contact: {
        type: String,
        required: true
    },
    telecaller_job_profile: {
        type: String,
        required: true
    }
});

TelecallerSchema.plugin(uniqueValidator);

const Telecaller = module.exports = mongoose.model('Telecaller', TelecallerSchema);

// Find the telecaller by ID
module.exports.getTelecallerById = function (id, callback) {
    Telecaller.findById(id, callback);
}

// Find the telecaller by Its username
module.exports.getTelecallerByUsername = function (telecaller_username, callback) {
    const query = {
        telecaller_username: telecaller_username
    }
    Telecaller.findOne(query, callback);
}

// to Register the telecaller
module.exports.addTelecaller = function (newTelecaller, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newTelecaller.telecaller_password, salt, (err, hash) => {
            if (err) throw err;
            newTelecaller.telecaller_password = hash;
            newTelecaller.save(callback);
        });
    });
}

// Compare Password
module.exports.comparePassword = function (telecaller_password, hash, callback) {
    bcrypt.compare(telecaller_password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}