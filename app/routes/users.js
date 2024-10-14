const express = require("express");
const router = express.Router();
const users = require("../controllers/users")


router.get('/login', users.render_login)

router.get('/adduser', users.render_adduser)

router.post('/login', users.login)

router.get('/logout', users.logout)

router.post('/adduser', users.adduser)

module.exports = router;