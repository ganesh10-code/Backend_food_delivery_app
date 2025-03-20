const Firm = require("../model/Firm");
const Product = require("../model/Product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images to "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });
    const savedProduct = await product.save();

    firm.products.push(savedProduct);
    await firm.save();

    res.status(200).json(savedProduct);
    console.log("product added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const getProductsByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }
    const products = await Product.find({ firm: firmId });
    const restaurantName = firm.firmName;
    res.status(200).json({ restaurantName, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct) {
      return res.status(404).json({ error: "No product found" });
    }
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductsByFirm,
  deleteProductById,
};
