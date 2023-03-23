const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    reuqired: true,
  },
  email: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  age: { type: Number },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: {
      type: Number,
    },
    Admin: {
      type: Number,
    },
  },
  password: {
    type: String,
    require: true,
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
