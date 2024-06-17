import { Schema, Document, model } from 'mongoose';

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

const investorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    fundingCap: { type: Number, min: 5000000, max: 90000000 },
    developmentStatus: { type: Number, default: 0, max: 1 },
    returnPeriod: { type: Number, min: 1 },
  },
});

module.exports = model('Investor', investorSchema);

