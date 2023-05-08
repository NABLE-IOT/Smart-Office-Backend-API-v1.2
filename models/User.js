import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please provide user name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 3,
    select: false,
  },

  role: {
    type: String,
    enum: ["User", "Manager", "Admin"],
    default: "Admin",
  },

  isVerify: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Number,
    require: true,
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", userSchema);
