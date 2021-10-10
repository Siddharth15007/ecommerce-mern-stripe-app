const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const ProductModel = require("../models/Product");
const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new ProductModel(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {}
});

//UPDATE
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE USER
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await ProductModel.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await ProductModel.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await ProductModel.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
