const {
  allocateFunds,
  createDepositePlans,
  deleteDepositePlans,
  getCustomerDepositePlansDetails,
} = require("../models/depositModel");

// Allocate funds function
const allocateFundsHandler = (req, res) => {
  const { deposits } = req.body;

  try {
    const allocations = allocateFunds(deposits);
    return res.json({
      success: true,
      data: allocations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fund allocation",
      error: error.message,
    });
  }
};

// Create the deposit
const createDepositePlanHandler = (req, res) => {
  const { depositPlan, refNo } = req.body;

  try {
    const allocations = createDepositePlans(depositPlan, refNo);
    return res.json({
      success: true,
      data: allocations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in create",
      error: error.message,
    });
  }
};

//delete the deposite that create
const deleteDepositePlansHandler = (req, res) => {
  const { refNo, depositId } = req.params;

  try {
    const updatedDepositePlan = deleteDepositePlans(refNo, depositId);
    return res.json({
      success: true,
      data: updatedDepositePlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Delete",
      error: error.message,
    });
  }
};

//get customer all details
const getCustomerDepositePlansDetailsHandler = (req, res) => {
  const { refNo } = req.params;

  try {
    const cusDetails = getCustomerDepositePlansDetails(refNo);
    return res.json({
      success: true,
      data: cusDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Delete",
      error: error.message,
    });
  }
};

module.exports = {
  allocateFundsHandler,
  createDepositePlanHandler,
  deleteDepositePlansHandler,
  getCustomerDepositePlansDetailsHandler,
};
