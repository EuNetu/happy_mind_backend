const router = require('express').Router()

const TeacherRecordController = require('../controllers/TeacherRecordController')

const verifyToken = require("../helpers/checkToken");

router.get('/all', verifyToken, TeacherRecordController.getAllRecords)
router.get('/:id', verifyToken, TeacherRecordController.getRecordById)
router.patch('/:id', verifyToken, TeacherRecordController.updateRecord)
router.post('/create', verifyToken, TeacherRecordController.createRecord)
router.post('/filter', verifyToken, TeacherRecordController.getAllRecordsWithFilters)

module.exports = router