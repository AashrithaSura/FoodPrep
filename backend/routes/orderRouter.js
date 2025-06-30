const express = require('express');
const router = express.Router();
const ordercontroller = require('../controllers/ordercontroller');
const authMiddleware = require('../middlewares/auth');

router.post('/place', authMiddleware, ordercontroller.PlaceOrder);
router.get('/list', ordercontroller.listOrders);
router.post('/update-status', authMiddleware, ordercontroller.updateStatus);
router.get('/userorders', authMiddleware, ordercontroller.userOrders);
router.patch('/cancel/:id', authMiddleware, ordercontroller.cancelOrder);
router.post('/verify', ordercontroller.verifyOrder);
router.post('/rate', authMiddleware, ordercontroller.rateItem);

module.exports = router;
