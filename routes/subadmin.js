const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Subadmin = require('../models/Subadmin');
const config = require('../config/database');


router.post('/register', (req, res) => {
    let newSubadmin = new Subdmin({
        subadmin_name: req.body.subadmin_name,
        subadmin_username: req.body.subadmin_username,
        subadmin_email: req.body.subadmin_email,
        subadmin_contact: req.body.subadmin_contact,
        subadmin_password: req.body.subadmin_password,
        subadmin_job_profile: req.body.subadmin_job_profile
    });
    Subadmin.addSubadmin(newSubadmin, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.subadmin_username) message = "Username is already taken. ";
            if (err.errors.subadmin_email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "Admin registration is successful."
            });
        }
    });
});

router.post('/login', (req, res) => {
    const subadmin_username = req.body.subadmin_username;
    const subadmin_password = req.body.subadmin_password;

    Subadmin.getSubadminByUsername(subadmin_username, (err, subadmin) => {
        if (err) throw err;
        if (!subadmin) {
            return res.json({
                success: false,
                message: "Subadmin not found."
            });
        }

        Subadmin.comparePassword(subadmin_password, subadmin.subadmin_password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "subadmin",
                    data: {
                        _id: subadmin._id,
                        subadmin_username: subadmin.subadmin_username,
                        subadmin_name: subadmin.subadmin_name,
                        subadmin_email: subadmin.subadmin_email,
                        subadmin_contact: subadmin.subadmin_contact,
                        subadmin_job_profile: subadmin.subadmin_job_profile
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