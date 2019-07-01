const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Telecaller = require('../models/Telecaller');
const config = require('../config/database');


router.post('/register', (req, res) => {
    let newTelecaller = new Telecaller({
        telecaller_name: req.body.telecaller_name,
        telecaller_username: req.body.telecaller_username,
        telecaller_email: req.body.telecaller_email,
        telecaller_contact: req.body.telecaller_contact,
        telecaller_password: req.body.telecaller_password,
        telecaller_job_profile: req.body.telecaller_job_profile
    });
    Telecaller.addTelecaller(newTelecaller, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.telecaller_username) message = "Username is already taken. ";
            if (err.errors.telecaller_email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "Telecaller registration is successful."
            });
        }
    });
});

router.post('/login', (req, res) => {
    const telecaller_username = req.body.telecaller_username;
    const telecaller_password = req.body.telecaller_password;

    Telecaller.getTelecallerByUsername(telecaller_username, (err, telecaller) => {
        if (err) throw err;
        if (!telecaller) {
            return res.json({
                success: false,
                message: "telecaller not found."
            });
        }

        Telecaller.comparePassword(telecaller_password, telecaller.telecaller_password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "telecaller",
                    data: {
                        _id: telecaller._id,
                        telecaller_username: telecaller.telecaller_username,
                        telecaller_name: telecaller.telecaller_name,
                        telecaller_email: telecaller.telecaller_email,
                        telecaller_contact: telecaller.telecaller_contact,
                        telecaller_job_profile: telecaller.telecaller_job_profile
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});

/**
 * Get Authenticated user profile
 */

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});

module.exports = router;