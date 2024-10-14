const express = require("express");
const router = express.Router();

router.get('/home', (req, res) => {
    res.render('homepage');
})

router.get('/register', (req, res) => {
    res.render('register');
})

module.exports = router;