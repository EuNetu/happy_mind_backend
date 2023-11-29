const router = require('express').Router()

const ResponsibleRecordController = require('../controllers/ResponsibleRecordController')

const verifyToken = require("../helpers/checkToken");

router.get('/:id/all', verifyToken, ResponsibleRecordController.getAllRecords)
router.get('/:id', verifyToken, ResponsibleRecordController.getRecordById)
router.patch('/:id', verifyToken, ResponsibleRecordController.updateRecord)
router.post('/create/:id', verifyToken, ResponsibleRecordController.createRecord)

module.exports = router