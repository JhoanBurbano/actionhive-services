const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  avatar: { type: Number, default: 0 },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
});

userSchema.methods.encryptPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


 module.exports = model("User", userSchema);
