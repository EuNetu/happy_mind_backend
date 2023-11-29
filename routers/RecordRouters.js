const router = require('express').Router()

const RecordController = require('../controllers/RecordController')

// middlewares
const verifyToken = require("../helpers/checkToken");

router.get('/:id/all', verifyToken, RecordController.getAllRecords)
router.get('/:id', verifyToken, RecordController.getRecordById)
router.patch('/:id', verifyToken, RecordController.updateRecord)
router.post('/create/:id', verifyToken, RecordController.createRecord)

module.exports = router