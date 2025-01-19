// store file
const { customers } = require("../store");

/**
 *
 * @param {object} findCustomer relevent customer
 * @param {number} remainingAmount remaining amount
 */
const distributeRemainingPercentage = (findCustomer, remainingAmount) => {
  const totalportfolioPlanAmountObj = {};
  let totalPlanAmount = 0;
  // map each plan and calculate each sum values
  findCustomer.depositPlans.forEach((plan) => {
    plan.portfolios.map((portfolio) => {
      totalPlanAmount += portfolio.amount;
      totalportfolioPlanAmountObj[portfolio.portfolio] =
        totalportfolioPlanAmountObj[portfolio.portfolio]
          ? totalportfolioPlanAmountObj[portfolio.portfolio] + portfolio.amount
          : portfolio.amount;
    });
  });

  const portfolios = Object.keys(findCustomer.allocations);
  const remainigForCal = remainingAmount;
  // iterate portfolios and calculate percentage value then allocate to relevent portfolio
  portfolios.forEach((key, index) => {
    const percentageValue = parseFloat(
      (
        (remainigForCal * totalportfolioPlanAmountObj[key]) /
        totalPlanAmount
      ).toFixed(2)
    );

    findCustomer.allocations[key] = Number(
      parseFloat(findCustomer.allocations[key] + percentageValue).toFixed(2)
    );
    remainingAmount = remainingAmount - percentageValue;
  });
  // check balance and allocate it into first portfolio

  if (remainingAmount > 0) {
    findCustomer.allocations[Object.keys(findCustomer.allocations)[0]] = Number(
      parseFloat(
        findCustomer.allocations[Object.keys(findCustomer.allocations)[0]] +
          remainingAmount
      ).toFixed(2)
    );
    remainingAmount = remainingAmount - remainingAmount;
  }
};

/**
 *
 * @param {object} findCustomer relevent customer
 * @param {number} remainingAmount remaining amount
 */
const distributeRemainingEqual = (findCustomer, remainingAmount) => {
  const portfolios = Object.keys(findCustomer.allocations);
  const numberOfportfolios = portfolios.length;
  const dividedValue = parseFloat(
    (remainingAmount / numberOfportfolios).toFixed(2)
  );
  const totalAllocated = dividedValue * numberOfportfolios;
  const roundingDifference = parseFloat(
    (remainingAmount - totalAllocated).toFixed(2)
  );
  // iterate portfolios and assign each equal values and add difference to first portfolio
  portfolios.forEach((key, index) => {
    findCustomer.allocations[key] +=
      dividedValue + (index === 0 ? roundingDifference : 0);
    remainingAmount -= dividedValue + (index === 0 ? roundingDifference : 0);
  });
};

// just create saving portfolio and allocate money into that
/**
 *
 * @param {object} findCustomer relevent customer
 * @param {number} remainingAmount remaining amount
 */
const distributeSaving = (findCustomer, remainingAmount) => {
  if (!findCustomer.allocations["saving"]) {
    findCustomer.allocations["saving"] = remainingAmount;
    remainingAmount -= remainingAmount;
  } else {
    findCustomer.allocations["saving"] += remainingAmount;
    remainingAmount -= remainingAmount;
  }
};

/**
 *
 * @param {object} findCustomer relevent customer
 * @param {number} remainingAmount remaining amount
 * @param {string} distributePlane user selected plan
 */
const distributeRemaining = (
  findCustomer,
  remainingAmount,
  distributePlane
) => {
  switch (distributePlane) {
    case "percentage": {
      distributeRemainingPercentage(findCustomer, remainingAmount);
      break;
    }
    case "Equal": {
      distributeRemainingEqual(findCustomer, remainingAmount);
      break;
    }
    case "Saving": {
      distributeSaving(findCustomer, remainingAmount);
      break;
    }
    default: {
      distributeSaving(findCustomer, remainingAmount);
      break;
    }
  }
};

/**
 *
 * @param {object} deposit amount with ref number
 * @returns
 */
const allocateFunds = (deposit) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  // find customer base on the ref number
  const findCustomer = customers.find(
    (customer) => customer.referenceCode == deposit.referenceNo
  );
  if (!findCustomer) {
    return `Customer with reference number ${deposit.referenceNo} not found.`;
  }

  const customerDepositPlans = findCustomer.depositPlans;
  // Initialize allocation for portfolios with 0
  for (const plan of customerDepositPlans) {
    for (const portfolioObj of plan.portfolios) {
      if (!findCustomer.allocations[portfolioObj.portfolio])
        findCustomer.allocations[portfolioObj.portfolio] = 0;
    }
  }
  let remainingAmount = deposit.amount;

  // find the onetime customer plans
  const oneTimePlans = customerDepositPlans.filter(
    (depositPlans) =>
      depositPlans.type === "oneTime" && depositPlans.isComplete == false
  );

  if (oneTimePlans.length) {
    // iterate the onetime plan and get portfolios
    for (const oneTimePlan of oneTimePlans) {
      // calculate total plan amount for one onetime plan
      let totalPlanAmount = oneTimePlan.portfolios.reduce(
        (sum, portfolio) => sum + portfolio.amount,
        0
      );
      // calculate paid total amount for one onetime plan
      let totalPlanPaidAmount = findCustomer.diposits
        .filter((diposit) => diposit.depositePlanId == oneTimePlan.id)
        .reduce((sum, deposit) => sum + deposit.depositeAmount, 0);
      if (remainingAmount > 0) {
        // iterate the portfolios for relevant onetime plan
        for (const portfolioObj of oneTimePlan.portfolios) {
          if (remainingAmount > 0) {
            // calculate the paid total for this portfolio
            const totalPortfolioAmountPaid = findCustomer.diposits
              .filter(
                (diposit) =>
                  diposit.depositePlanId == oneTimePlan.id &&
                  diposit.depositeportfolioId == portfolioObj.id
              )
              .reduce((sum, deposit) => sum + deposit.depositeAmount, 0);

            const outStanding = portfolioObj.amount - totalPortfolioAmountPaid;
            // check portfolio need to update and outstanding amount
            if (portfolioObj.amount > 0 && outStanding > 0) {
              // if it has enough amount to complete the portfolio with plan, pay for it
              if (portfolioObj.amount <= remainingAmount) {
                // update allocation
                findCustomer.allocations[portfolioObj.portfolio] +=
                  portfolioObj.amount;
                findCustomer.diposits.push({
                  depositePlanId: oneTimePlan.id,
                  depositeportfolioId: portfolioObj.id,
                  depositeportfolioAmount: portfolioObj.amount,
                  depositeAmount: portfolioObj.amount,
                  createdDate: new Date(),
                });
                // update remaining amount
                remainingAmount -= portfolioObj.amount;
                // update plan paid amount
                totalPlanPaidAmount += portfolioObj.amount;
              } else {
                // do the payment with remaining amount
                findCustomer.allocations[portfolioObj.portfolio] +=
                  remainingAmount;
                findCustomer.diposits.push({
                  depositePlanId: oneTimePlan.id,
                  depositeportfolioId: portfolioObj.id,
                  depositeportfolioAmount: portfolioObj.amount,
                  depositeAmount: remainingAmount,
                  createdDate: new Date(),
                });

                totalPlanPaidAmount += remainingAmount;
                remainingAmount -= remainingAmount;
              }
            }
          } else {
            break;
          }
        }
      } else {
        break;
      }
      // if the payment complete change the one time plan as complete
      if (totalPlanAmount === totalPlanPaidAmount) {
        oneTimePlan.isComplete = true;
      }
    }
  }

  // then get the monthly plan
  const monthlyPlans = customerDepositPlans.filter(
    (depositPlans) => depositPlans.type === "Monthly"
  );
  if (monthlyPlans.length) {
    for (const monthlyPlan of monthlyPlans) {
      if (remainingAmount > 0) {
        for (const portfolioObj of monthlyPlan.portfolios) {
          if (remainingAmount > 0) {
            // calculate the total portfolio payment for relevant plan in this month and year
            const totalAmountPaid = findCustomer.diposits
              .filter(
                (diposit) =>
                  diposit.depositePlanId == monthlyPlan.id &&
                  diposit.depositeportfolioId == portfolioObj.id &&
                  diposit.createdDate.getMonth() === currentMonth &&
                  diposit.createdDate.getFullYear() === currentYear
              )
              .reduce((sum, deposit) => sum + deposit.depositeAmount, 0);
            // calculate outstanding for this month
            const outStanding = portfolioObj.amount - totalAmountPaid;

            if (outStanding > 0 && portfolioObj.amount > 0) {
              if (portfolioObj.amount <= remainingAmount) {
                findCustomer.allocations[portfolioObj.portfolio] +=
                  portfolioObj.amount;
                findCustomer.diposits.push({
                  depositePlanId: monthlyPlan.id,
                  depositeportfolioId: portfolioObj.id,
                  depositeportfolioAmount: portfolioObj.amount,
                  depositeAmount: portfolioObj.amount,
                  createdDate: new Date(),
                });
                remainingAmount -= portfolioObj.amount;
              } else {
                findCustomer.allocations[portfolioObj.portfolio] +=
                  remainingAmount;
                findCustomer.diposits.push({
                  depositePlanId: monthlyPlan.id,
                  depositeportfolioId: portfolioObj.id,
                  depositeportfolioAmount: portfolioObj.amount,
                  depositeAmount: remainingAmount,
                  createdDate: new Date(),
                });
                remainingAmount -= remainingAmount;
              }
            }
          } else {
            break;
          }
        }
      } else {
        break;
      }
    }
  }

  if (remainingAmount > 0) {
    distributeRemaining(
      findCustomer,
      remainingAmount,
      findCustomer.distributeRemainingPlan
    );
  }
  return findCustomer;
};

/**
 *
 * @param {object} depositPlan deposite plan object
 * @param {number} refNo customer unique ref no
 * @returns
 */
const createDepositePlans = (depositPlan, refNo) => {
  const findCustomer = customers.find(
    (customer) => customer.referenceCode === refNo
  );
  findCustomer.depositPlans.push({
    ...depositPlan,
    id: Math.random().toString().substr(2, 9),
  });
  return findCustomer.depositPlans;
};

/**
 *
 * @param {number} refNo customer ref no
 * @param {string} depositId selected deposit plan
 * @returns
 */
const deleteDepositePlans = (refNo, depositId) => {
  const findCustomer = customers.find(
    (customer) => customer.referenceCode == refNo
  );
  if (!findCustomer) {
    return `Customer with reference number ${refNo} not found.`;
  }
  const planIndex = findCustomer.depositPlans.findIndex(
    (plan) => plan.id == depositId
  );
  // If no deposit plan is found, return an error message
  if (planIndex === -1) {
    return `Deposit plan with ID ${depositId} not found.`;
  }
  // Remove the deposit plan from the array
  findCustomer.depositPlans.splice(planIndex, 1);
  return findCustomer.depositPlans;
};

/**
 *
 * @param {number} refNo
 * @returns
 */
const getCustomerDepositePlansDetails = (refNo) => {
  const findCustomer = customers.find(
    (customer) => customer.referenceCode == refNo
  );

  return findCustomer;
};

module.exports = {
  allocateFunds,
  createDepositePlans,
  deleteDepositePlans,
  getCustomerDepositePlansDetails,
};
