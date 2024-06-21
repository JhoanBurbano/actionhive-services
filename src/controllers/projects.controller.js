const projectService = require('../services/projects.service');

const getProjects = async (req, res) => {
    const response = await projectService.getProjects();
    res.status(response.status).json(response);
}

const getUserProjects = async (req, res) => {
    const response = await projectService.getUserProjects(req.user._id);
    res.status(response.status).json(response);
}

const getProject = async (req, res) => {
    const response = await projectService.getProject(req.params.id);
    res.status(response.status).json(response);
}

const createProject = async (req, res) => {
    const response = await projectService.createProject(req.body);
    res.status(response.status).json(response);
}

const updateProject = async (req, res) => {
    const response = await projectService.updateProject(req.params.id, req.body);
    res.status(response.status).json(response);
}

const deleteProject = async (req, res) => {
    const response = await projectService.deleteProject(req.params.id);
    res.status(response.status).json(response);
}

module.exports = {
    getProjects,
    getUserProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
};
