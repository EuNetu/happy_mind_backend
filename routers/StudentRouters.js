const router = require('express').Router()

const StudentController = require('../controllers/StudentController')

// middlewares
const verifyToken = require("../helpers/checkToken");

router.get('/all', verifyToken, StudentController.getAllStudents)
router.get('/:id', verifyToken, StudentController.getStudentById)
router.patch('/:id', verifyToken, StudentController.updateStudent)
router.post('/create', verifyToken, StudentController.createStudent)
router.post('/filter', verifyToken, StudentController.getAllStudentsWithFilters)

module.exports = router