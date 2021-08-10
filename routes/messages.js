const express = require("express");
const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const ExpressError = require("../expressError");

const Message = require('../models/message')
const User = require('../models/user')


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', async (req, res, next) => {
    try {
        const message = await Message.get(req.params.id);
        console.log(message.from_user, message.to_user, req.user);
        if (message.from_user.username !== req.user.username && message.to_user.username !== req.user.username) {
            throw new ExpressError("Unauthorized", 401);
        }
        return res.json({message});
    } catch(err) {
        return next(err);
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
 router.post('/', async (req, res, next) => {
    try {
        const {to_username, body} = req.body;
        const message = await Message.create({from_username:req.user.username, to_username, body});
        return res.json({message});
    } catch(err) {
        return next(err);
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
 router.post('/:id/read', async (req, res, next) => {
    try {
        let message = await Message.get(req.params.id);
        if (message.to_user.username !== req.user.username) {
            throw new ExpressError("Unauthorized", 401);
        }
        message = await Message.markRead(req.params.id);
        console.log(message)
        return res.json({message});
    } catch(err) {
        return next(err);
    }
})

 module.exports = router;