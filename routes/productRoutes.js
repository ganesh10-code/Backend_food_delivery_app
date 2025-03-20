const express = require("express");
const productController = require("../controller/productController");
const router = express.Router();

router.post("/add_product/:firmId", productController.addProduct);
router.get("/get_product/:firmId", productController.getProductsByFirm);
router.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  req.headersSent("Content-Type", "image/jpeg");
  res.sendFile(Path.join(__dirname, "..", "uploads", imageName));
});
router.delete("/:productId", productController.deleteProductById);

module.exports = router;
