const Cart = require("../models/Cart");
// const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const addToCart = async (req, res) => {
  console.log('1vfvv',req.body.tour);
  req.body.user = req.user.userId;
  const tour = req.body.tour;
  const existingCart = await Cart.findOne({
    user: req.body.userId,
    tour,
  });
  if (existingCart) {
    throw new CustomError.BadRequestError("Tour already exists in Cart");
  } else {
    const cart = await Cart.create(req.body);
    res.status(StatusCodes.CREATED).json({ cart });
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({});
    res.status(StatusCodes.OK).json({ cartItems });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getUserCartItems = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.userId })
    .populate(
      "tour",
      "title city"
    );
    console.log(cart);
    res.status(StatusCodes.OK).json({ cart });
  } catch (err) {
    console.log(err);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findOne({ _id: id });

    if (!cartItem) {
      throw new CustomError.NotFoundError(`No Cart Item with id : ${id}`);
    }

    await cartItem.deleteOne();
    res.status(StatusCodes.OK).json({ msg: "Success! Tour removed from cart." });
  }
  catch (err) {
  console.log(err);    
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getUserCartItems,
  getCartItems,
};
