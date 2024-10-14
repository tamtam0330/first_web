const express = require("express");
const router = express.Router();
const board = require("../controllers/board")

router.get('/', board.bring_board)    

router.post('/', board.post_board)

router.get('/delete', board.delete)

router.post('/update', board.update)

module.exports = router;