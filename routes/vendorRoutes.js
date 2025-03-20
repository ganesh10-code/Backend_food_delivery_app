const vendorController = require("../controller/vendorController");
const express = require("express");
const router = express.Router();

router.post("/register", vendorController.vendorRegister);
router.post("/login", vendorController.vendorLogin);
router.get("/all_vendors", vendorController.getAllVendors);
router.get("/get_vendor/:id", vendorController.getVendorById);

module.exports = router;
