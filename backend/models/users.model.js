const { Schema, model } = require("mongoose");
const { USER, ADMIN } = require("../utils/userRole");

const userSchema = new Schema({
  username: {
    type: String,
    min: [2, "Must be at least 2, got {VALUE}"],
    max: 15,
    required: [true, "Username required"],
    unique: true,
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `"${props.value}" is not a valid email!`,
    },
    required: [true, "User email required"],
    unique: true,
  },
  password: {
    type: String,
    min: [2, "Must be at least 5, got {VALUE}"],
    max: 15,
    required: [true, "password is required"],
  },
  role: {
    type: String,
    enum: [USER, ADMIN],
    default: USER,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new model("User", userSchema);
