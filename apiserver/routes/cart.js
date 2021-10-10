const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CartModel = require("../models/Cart");
const router = require("express").Router();

//CREATE CART
router.post("/", verifyToken, async (req, res) => {
  const newCart = new CartModel(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {}
});

//UPDATE CART
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await CartModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE CART
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await CartModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userID: req.params.userId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL PRODUCTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await CartModel.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
