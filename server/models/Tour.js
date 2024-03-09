const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
      minlength: [3, "Enter a valid title"],
      maxlength: [50, "Enter a valid title"],
      match: [/^[A-Za-z\s]+$/, "Enter a valid title"],
    },
    price: {
      type: Number,
      required: [true, "Please provide tour price"],
      min: [500, "Price must be greater than 500"],
      match: [/^\d+(,\d{3})*(\.\d{2})?$/, "Enter a valid price"],
    },
    description: {
      type: String,
      required: [true, "Please provide tour description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    city: {
      type: String,
      required: [true, "Please provide tour city"],
      match: [/^[A-Za-z\s]+$/, "Enter a valid city"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Tour", TourSchema);
