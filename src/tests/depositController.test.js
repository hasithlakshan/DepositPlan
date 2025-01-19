const request = require("supertest");
const express = require("express");
const depositRoutes = require("../routes/api");

const app = express();
app.use(express.json());
app.use("/api/deposits", depositRoutes);

describe("POST /api/deposits/allocate", () => {
  it("should allocate funds correctly based on deposit plans", async () => {
    const deposits = { deposits: { amount: 10600, referenceNo: "12345" } };
    expect(deposits).toEqual(deposits);
    const response = await request(app)
      .post("/api/deposits/allocate")
      .send(deposits);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.allocations).toEqual({
      "High Risk": 10000,
      Retirement: 600,
    });
  });

  it("should allocate funds correctly based on deposit plans", async () => {
    const deposits = { deposits: { amount: 100, referenceNo: "12345" } };
    expect(deposits).toEqual(deposits);
    const response = await request(app)
      .post("/api/deposits/allocate")
      .send(deposits);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data.allocations).toEqual({
      "High Risk": 10094.34,
      Retirement: 605.66,
    });
  });

  it("should allocate funds correctly based on deposit plans", async () => {
    const deposits = { deposits: { amount: 10750, referenceNo: "12345" } };
    expect(deposits).toEqual(deposits);
    const response = await request(app)
      .post("/api/deposits/allocate")
      .send(deposits);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.allocations).toEqual({
      "High Risk": 20235.85,
      Retirement: 1214.15,
    });
  });
});
