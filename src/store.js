// const portfolios = ["High Risk", "Retirement"];

// const deposits = [
//   {
//     referenceCode: 12345,
//     amount: 10500,
//   },
//   {
//     referenceCode: 12345,
//     amount: 100,
//   },
// ];

const customers = [
  {
    referenceCode: 12345,
    depositPlans: [
      {
        id: "1234",
        type: "Monthly",
        lastUpdateDate: new Date(),
        isComplete: false,
        portfolios: [
          {
            id: "123222",
            portfolio: "High Risk",
            amount: 0,
          },
          {
            id: "123227",
            portfolio: "Retirement",
            amount: 100,
          },
        ],
      },
      {
        id: "5442",
        type: "oneTime",
        lastUpdateDate: new Date(),
        isComplete: false,
        portfolios: [
          {
            id: "123224",
            portfolio: "High Risk",
            amount: 10000,
          },
          {
            id: "123228",
            portfolio: "Retirement",
            amount: 500,
          },
        ],
      },
    ],
    allocations: {},
    diposits: [],
    distributeRemainingPlan: "percentage",
  },
];

module.exports = { customers };
