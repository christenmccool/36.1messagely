const express = require("express");
const axios = require("axios");

const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const User = require('../models/user')


router.get("/", function(req, res, next) {
    return res.render("index.html");
});

router.get("/login", function(req, res, next) {
    return res.render("login.html");
});

router.get("/signup", function(req, res, next) {
    return res.render("signup.html");
});

router.get("/messages", function(req, res, next) {
    return res.render("messages.html");
});

// router.get("/messages", async function(req, res, next) {
//     const username = req.user.username;
//     const to_messages = await axios.get(`/users/${username}/to`, {params: {"_token":token}});
//     const from_messages = await axios.get(`/users/${username}/from`, {params: {"_token":token}});

//     return res.render("messages.html", to_messages, from_messages);
// });

module.exports = router;
