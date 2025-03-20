const Firm = require("../model/Firm");
const Vendor = require("../model/vendor");
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

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor is not found" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor.id,
    });

    const savedFirm = await firm.save();

    vendor.firm.push(savedFirm);

    await vendor.save();

    return res.status(200).json({ message: "Firm added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deleteFirm = await Firm.findByIdAndDelete(firmId);
    if (!deleteFirm) {
      return res.status(404).json({ error: "No Firm found" });
    }
    res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
