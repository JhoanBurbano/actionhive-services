const { Schema, Document, model } = require("mongoose");

// interface InvestorPreferences {
//   fundingCap: number;
//   developmentStatus: string;
//   returnPeriod: number;
// }

// export interface IInvestor {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   preferences: InvestorPreferences;
// }

// type IInvestorDocument = IInvestor & Document

// const investorSchema = new Schema({
//   avatar: { type: Number, default: 0 },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   preferences: {
//     fundingCap: { type: Number, min: 5000000, max: 90000000 },
//     developmentStatus: { type: Number, default: 0, max: 1 },
//     returnPeriod: { type: Number, min: 1 },
//   },
//   isActive: { type: Boolean, default: true },
//   isVerified: { type: Boolean, default: false },
// });

const investorSchema = new Schema({
  avatar: { type: Number, default: 0 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    fundingCap: { type: Number, min: 5000000, max: 90000000 },
    riskTolerance: { type: Number, min: 0, max: 1 }, // Tolerancia al riesgo
    expectedReturnRate: { type: Number, min: 0, max: 1 }, // Tasa de retorno esperada
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  portfolio: [{ type: Schema.Types.ObjectId, ref: 'Project' }], // Portafolio de proyectos invertidos
  joinedDate: { type: Date, default: Date.now },
  bio: { type: String },
  location: { type: String },
  socialLinks: [{ type: String }],
});


module.exports = model('Investor', investorSchema);

