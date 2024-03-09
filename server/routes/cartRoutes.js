const express = require("express");
const router = express.Router();
const {
  authenticateUser,
} = require("../middlewares/authentication");
const {
    addToCart,
    removeFromCart,
    getUserCartItems,
    getCartItems
} = require("../controllers/cartController");

router
  .route("/")
  .post([authenticateUser], addToCart)
  .get(authenticateUser,getUserCartItems);

router
  .route("/:id")
//   .get(getUserCartItems)
  .delete([authenticateUser], removeFromCart);


module.exports = router;
