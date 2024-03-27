"use strict";

const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValueOnce(100000);
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({
      shipped: 100000,
     });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if request body does not contain all data", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 1000,
        name: "test",
        addr: "21334 uhhh ave"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if request body contains extra data", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 1000,
        name: "test",
        addr: "21334 uhhh ave",
        zip: "65304-2222",
        extra: "this is not needed"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if request body contains wrong data type", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 1000.5,
        name: "test",
        addr: "21334 uhhh ave",
        zip: 65304,
      });
    expect(resp.statusCode).toEqual(400);
  });

});
