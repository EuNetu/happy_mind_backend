const router = require('express').Router()

const ChildController = require('../controllers/ChildController')

// middlewares
const verifyToken = require("../helpers/checkToken");

router.post('/create', verifyToken, ChildController.createChild)
router.post('/all', verifyToken, ChildController.getAllChildren)

module.exports = router