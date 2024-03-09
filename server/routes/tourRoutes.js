const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const upload = require("../middlewares/multer");
const {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
  uploadImages,
  getTourBySearch,
  getTourCount,
} = require("../controllers/tourController");


router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createTour)
  .get(getAllTours);

router.post("/uploadImage", [authenticateUser], upload, uploadImages);

router
  .route("/:id")
  .get(getSingleTour)
  .patch(
    [authenticateUser, authorizePermissions("admin")],upload,
    updateTour
  )
  .delete(
    [authenticateUser, authorizePermissions("admin")],
    deleteTour
  );

router.get("/search/getTourBySearch", getTourBySearch);
router.get("/search/getTourCount", getTourCount);

module.exports = router;
