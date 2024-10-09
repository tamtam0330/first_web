
const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get('/', ctrl.login)

router.get('/login', ctrl.login)

router.get('/adduser', ctrl.adduser)

router.get('/register', ctrl.register)

router.get('/homepage', ctrl.homepage)




module.exports = router;