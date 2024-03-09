const Tour = require("../models/Tour");
// const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const createTour = async (req, res) => {

  req.body.user = req.user.userId;
  const tour = await Tour.create(req.body);
  res.status(StatusCodes.CREATED).json({ tour });
};


const getAllTours = async (req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = 8;
  const skip = (page - 1) * pageSize;

  const sortOption = req.query.sort; // Get the sorting option from the query

  // Define the sort order based on the selected option
  let sortOrder = {};

  if (sortOption === "rating") {
    sortOrder = { averageRating: -1 }; // Sort by averageRating in descending order
  } else if (sortOption === "city") {
    sortOrder = { city: 1 }; // Sort by city in ascending order
  } else if (sortOption === "title") {
    sortOrder = { title: 1 }; // Sort by city in ascending order
  } else if (sortOption === "price") {
    sortOrder = { price: -1 }; // Sort by city in ascending order
  }

  try {
    const tours = await Tour.find({ })
      .skip(skip)
      .limit(pageSize)
      .sort(sortOrder);

    res.status(StatusCodes.OK).json({ tours });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};


const getSingleTour = async (req, res) => {
  const { id: tourId } = req.params;

  const tour = await Tour.findOne({ _id: tourId })
    .limit(8)

  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  res.status(StatusCodes.OK).json({ tour });
};


const updateTour = async (req, res) => {
  const { id: tourId } = req.params;
  const tour = await Tour.findOneAndUpdate({ _id: tourId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  res.status(StatusCodes.OK).json({ tour });
};

const deleteTour = async (req, res) => {
  const { id: tourId } = req.params;

  const tour = await Tour.findOne({ _id: tourId });

  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  await tour.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Tour removed." });
};

const uploadImages = async (req, res) => {
  const uploadedImages = req.files;

  if (!uploadedImages || uploadedImages.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No images uploaded" });
  }

  // Ensure there are at least 1 and at most 4 images
  if (uploadedImages.length > 4) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Upload between 1 to 4 images" });
  }

  const imageUrls = [];

  try {
    for (const image of uploadedImages) {
      // Check file size (maximum 2 MB)
      if (image.size > 2 * 1024 * 1024) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: "File size exceeds 2 MB limit" });
      }

      const result = await cloudinary.uploader.upload(image.path, {
        use_filename: true,
        folder: "file-upload",
      });

      imageUrls.push(result.secure_url);
    }

    return res.status(StatusCodes.OK).json({ images: imageUrls });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `Failed to upload images: ${error.message}` });
  }
};



const getTourBySearch = async (req, res) => {
  const { city, page, perPage } = req.query; // Include page and perPage query parameters

  try {
    const currentPage = parseInt(page) || 1;
    const toursPerPage = parseInt(perPage) || 8; // Set a default value or adjust as needed
    const skipCount = (currentPage - 1) * toursPerPage;

    // Use a case-insensitive regex for city search
    const cityRegex = new RegExp(city, "i");

    // Use Mongoose aggregation to retrieve tours with pagination and case-insensitive search
    const [totalCount, tours] = await Promise.all([
      Tour.countDocuments({
        city: cityRegex, // Match city with case-insensitive regex
      }),
      Tour.aggregate([
        {
          $match: {
            city: cityRegex,
          },
        },
        {
          $skip: skipCount, // Skip documents based on the current page
        },
        {
          $limit: toursPerPage, // Limit the number of documents per page
        },
      ]),
    ]);
    res.status(200).json({
      success: true,
      message: "Successful",
      totalCount,
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};


// get tour counts
const getTourCount = async (req, res) => {
  try {
    const tours = await Tour.find({ });
    const tourCount = tours.length;
    res.status(200).json({ success: true, data: tourCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to fetch" });
  }
};


module.exports = {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
  uploadImages,
  getTourBySearch,
  getTourCount,
};
