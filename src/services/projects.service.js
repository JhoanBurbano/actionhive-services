const { toProjectView } = require("../mappers/projects.mapper");
const Project = require("../models/project.model");
const userServices = require("./user.service");

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

const getProject = async (id) => {
  try {
    const project = await Project.findById(id)
    .populate({ path: 'representant', select: 'firstname lastname email' })
    .populate({ path: 'team', select: 'firstname lastname email' })
    .exec();
    return { status: 200, data: project };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const createProject = async (projectBody) => {
  try {
    const project = new Project(projectBody);
    await project.save();
    return { status: 200, data: project };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const updateProject = async (id, projectBody) => {
  try {
    await Project.findByIdAndUpdate(id, projectBody);
    return { status: 300, message: "Project updated" };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

const deleteProject = async (id) => {
  try {
    await Project.findByIdAndDelete(id);
    return { status: 300, message: "Project deleted" };
  } catch (error) {
    console.log("error :>> ", error);
    return { status: 500, message: error.message };
  }
};

module.exports = {
  getProjects,
  getUserProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
