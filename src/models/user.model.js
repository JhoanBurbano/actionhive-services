const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// const userSchema = new Schema({
//   avatar: { type: Number, default: 0 },
//   firstname: { type: String, required: true },
//   lastname: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true },
//   projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
//   isActive: { type: Boolean, default: true },
//   isVerified: { type: Boolean, default: false },
//   preferences: {
//     preferredFundingCap: { type: Number, min: 5000000, max: 90000000 },
//     interestInAI: { type: Boolean, default: false },
//     developmentStagePreference: { type: Number, default: 0, max: 1 },
//     riskTolerance: { type: String, enum: ['Bajo', 'Moderado', 'Alto'], default: 'Medio' },
//     locationPreference: { type: String, default: "NN" },
//   },
// });

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
  preferences: {
    preferredFundingCap: { type: Number, min: 5000000, max: 90000000 },
    riskTolerance: { type: Number, min: 0, max: 1 }, // Tolerancia al riesgo
    expectedReturnRate: { type: Number, min: 0, max: 1 }, // Tasa de retorno esperada
  },
  joinedDate: { type: Date, default: Date.now },
  bio: { type: String },
  interests: [{ type: String }],
  skills: [{ type: String }],
  location: { type: String },
  socialLinks: [{ type: String }],
});


userSchema.methods.encryptPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


 module.exports = model("User", userSchema);
