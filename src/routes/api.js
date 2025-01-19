const express = require('express');
const router = express.Router();
const { allocateFundsHandler, createDepositePlanHandler, deleteDepositePlansHandler, getCustomerDepositePlansDetailsHandler } = require('../controllers/depositController');

router.post('/allocate', allocateFundsHandler);
router.post('/create', createDepositePlanHandler);
router.delete('/:refNo/:depositId', deleteDepositePlansHandler);
router.get('/:refNo', getCustomerDepositePlansDetailsHandler);

module.exports = router;
