import { Schema, model } from "mongoose";

// export interface IProject {
//   projectName?: string;
//   projectCategory?: string;
//   fundingCap?: number;
//   mechatronicComponents?: string[];
//   controlPlatforms?: string[];
//   designMethodology?: string;
//   hasAI?: boolean;
//   collaborators?: string[];
//   resourceOptimization?: string[];
//   location?: string[];
//   manufacturingTechnology?: string[];
//   developmentStatus?: number;
//   riskLevel?: string;
//   projectObjective?: string;
//   rewardType?: string[];
//   returnPeriod?: number;
//   competitiveLandscape?: string[];
//   description?: string;
//   isActive?: boolean;
//   projectImages?: string[];
//   cluster?: number;
// }

// export type IProjectClustered = IProject & { cluster: number };

// type IProjectDocument = IProject & Document;

const projectSchema = new Schema({
  projectName: { type: String },
  projectCategory: { type: String },
  fundingCap: { type: Number, min: 5000000, max: 90000000 },
  mechatronicComponents: [{ type: String }],
  controlPlatforms: [{ type: String }],
  designMethodology: { type: String },
  hasAI: { type: Boolean, default: false },
  collaborators: [{ type: String }],
  resourceOptimization: [{ type: String }],
  location: [{ type: String, default: "NN" }],
  manufacturingTechnology: [{ type: String }],
  developmentStatus: { type: Number, default: 0, max: 1 },
  riskLevel: { type: String },
  projectObjective: { type: String, required: true },
  rewardType: [{ type: String }],
  returnPeriod: { type: Number, min: 1 },
  competitiveLandscape: [{ type: String }],
  description: String,
  isActive: { type: Boolean, default: true },
  projectImages: [{ type: String, default: [] }],
  cluster: { type: Number, default: -1 },
});

// const Project = model<IProject>("Project", projectSchema);
module.exports = model("Project", projectSchema);