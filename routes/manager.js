const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');
const config = require('../config/database');


router.post('/register', (req, res) => {
    let newManager = new Manager({
        manager_name: req.body.manager_name,
        manager_username: req.body.manager_username,
        manager_email: req.body.manager_email,
        manager_contact: req.body.manager_contact,
        manager_password: req.body.manager_password,
        manager_job_profile: req.body.manager_job_profile
    });
    Manager.addManager(newManager, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.manager_username) message = "Username is already taken. ";
            if (err.errors.manager_email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "Manager registration is successful."
            });
        }
    });
});

router.post('/login', (req, res) => {
    const manager_username = req.body.manager_username;
    const manager_password = req.body.manager_password;

    Manager.getManagerByUsername(manager_username, (err, manager) => {
        if (err) throw err;
        if (!manager) {
            return res.json({
                success: false,
                message: "Manager not found."
            });
        }

        Manager.comparePassword(manager_password, manager.manager_password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "manager",
                    data: {
                        _id: manager._id,
                        manager_username: manager.manager_username,
                        manager_name: manager.manager_name,
                        manager_email: manager.manager_email,
                        manager_contact: manager.manager_contact,
                        manager_job_profile: manager.manager_job_profile
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