"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

const jsonschema = require("jsonschema");
const orderSchema = require("../schemas/order.json")
const orderMultiSchema = require("../schemas/orderMulti.json")

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(req.body, orderSchema, {required: true});
  if (!result.valid) {
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const shipId = await shipProduct(req.body);
  return res.json({ shipped: shipId });
});


router.post("/multi", async function (req, res, next) {
  const result = jsonschema.validate(req.body, orderMultiSchema, {required: true});
  if (!result.valid) {
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }
  const respPromises = req.body.productIds.map(async o => {
    const shipID = await shipProduct({
      productId : o,
      name: req.body.name,
      addr: req.body.addr,
      zip : req.body.zip
    });
    return shipID;
  });

  const settledFetchedPromises = await Promise.all(respPromises);

  return res.json({shipped : settledFetchedPromises})

});

module.exports = router;