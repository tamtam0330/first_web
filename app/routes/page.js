const express = require("express");
const router = express.Router();
const page = require("../controllers/page")

router.get('/', page.page )

router.post('/comment', page.comment)

router.get('/delete_comment', page.delete_comment)

router.get('/update_comment', page.update_comment)

module.exports = router;