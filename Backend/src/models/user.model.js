const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    // number: {
    //   type: String,
    //   required: [true, "Phone number is required"],
    //   unique: true,
    //   match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    // },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // important: password won't return by default
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
