const router = require('express').Router()

const GroupRecordController = require('../controllers/GroupRecordController')

const verifyToken = require("../helpers/checkToken");

router.get('/all', verifyToken, GroupRecordController.getAllRecords)
router.get('/:id', verifyToken, GroupRecordController.getRecordById)
router.patch('/:id', verifyToken, GroupRecordController.updateRecord)
router.post('/create', verifyToken, GroupRecordController.createRecord)
router.post('/filter', verifyToken, GroupRecordController.getAllRecordsWithFilters)

module.exports = router