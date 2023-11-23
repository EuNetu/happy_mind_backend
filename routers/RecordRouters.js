const router = require('express').Router()

const RecordController = require('../controllers/RecordController')

// middlewares
const verifyToken = require("../helpers/checkToken");

router.post('/create', verifyToken, RecordController.createRecord)
router.post('/all', verifyToken, RecordController.getAllRecords)

module.exports = router