const { toProjectView, toProjectDetail } = require("../mappers/projects.mapper");
const Project = require("../models/project.model");
const userServices = require("./user.service");
const investorService = require("./investor.service");
const clusteringService = require("./clustering.service");
const { generateRecommendations: recommendProjectsForUsers, clusterProjects } = require("./recomendations");
const { scriptUserPreferences } = require("./scripts.services");
const clusterModel = require("../models/cluster.model");

const getProjects = async () => {
  try {
    const projects = await Project.find();
    return { status: 200, data: projects };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const getUserProjects = async (id) => {
  try {
    const projectArray = await userServices.getProjectsByUserId(id);
    const projects = await Project.find({ _id: { $in: projectArray } })
    .populate({ path: 'representant', select: 'firstname lastname email' })
    .populate({ path: 'team', select: 'firstname lastname email' })
    .exec();
    // if (
    //   projects.some(
    //     (project) => project.representant === null && project.team.length === 0
    //   )
    // ) {
    //   projects.forEach(async (project) => {
    //     if (project.representant === null && project.team.length === 0) {
    //       await Project.findByIdAndUpdate(project._id, {
    //         representant: id,
    //         team: [id],
    //       });
    //     }
    //   });
    // }
    return { status: 200, data: toProjectView(projects)};
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const getProjectsRecomended = async (id) => {
  try {
    const projects = await Project.find()
    .populate({ path: 'representant', select: 'firstname lastname email' })
    .populate({ path: 'team', select: 'firstname lastname email' })
    .exec();
    const projectsParsed = clusteringService.transformProjectData(projects);
    const clusters = await clusterModel.find();
    const investor = await investorService.getInvestorById(id);
    const recommendedProjects = await clusteringService.recommendProjects(investor, {centroids: clusters.map(c => c.centroid)}, projects);
    return { status: 200, data: toProjectView(recommendedProjects) };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
}

const getUsersReccomendations = async (id) => {
  try {
    // await scriptUserPreferences();
    const recommendedProjects = await recommendProjectsForUsers(id)
    return { status: 200, data: toProjectView(recommendedProjects) };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const getProject = async (id) => {
  try {
    const project = await Project.findById(id)
    .populate({ path: 'representant', select: 'firstname lastname email' })
    .populate({ path: 'team', select: 'firstname lastname email' })
    .exec();
    return { status: 200, data: toProjectDetail(project) };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const createProject = async (projectBody) => {
  try {
    const project = new Project(projectBody);
    await project.save();
    if(await Project.countDocuments() % 10 === 0) {
      await clusterProjects();
    }
    return { status: 200, data: project };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const updateProject = async (id, projectBody) => {
  try {
    await Project.findByIdAndUpdate(id, {...projectBody});
    return { status: 201, message: "Project updated" };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const deleteProject = async (id) => {
  try {
    await Project.findByIdAndDelete(id);
    return { status: 201, message: "Project deleted" };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

module.exports = {
  getProjects,
  getUserProjects,
  getProjectsRecomended,
  getUsersReccomendations,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
