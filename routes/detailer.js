const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Detailer = require('../models/Detailer');
const config = require('../config/database');


router.post('/register', (req, res) => {
    let newDetailer = new Detailer({
        detailer_name: req.body.detailer_name,
        detailer_username: req.body.detailer_username,
        detailer_email: req.body.detailer_email,
        detailer_contact: req.body.detailer_contact,
        detailer_password: req.body.detailer_password,
        detailer_job_profile: req.body.detailer_job_profile
    });
    Detailer.addDetailer(newDetailer, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.detailer_username) message = "Username is already taken. ";
            if (err.errors.detailer_email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "Detailer registration is successful."
            });
        }
    });
});

router.post('/login', (req, res) => {
    const detailer_username = req.body.detailer_username;
    const detailer_password = req.body.detailer_password;

    Detailer.getDetailerByUsername(detailer_username, (err, detailer) => {
        if (err) throw err;
        if (!detailer) {
            return res.json({
                success: false,
                message: "Detailer not found."
            });
        }

        Detailer.comparePassword(detailer_password, detailer.detailer_password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "detailer",
                    data: {
                        _id: detailer._id,
                        detailer_username: detailer.detailer_username,
                        detailer_name:detailer.detailer_name,
                        detailer_email: detailer.detailer_email,
                        detailer_contact: detailer.detailer_contact,
                        detailer_job_profile:detailer.detailer_job_profile
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