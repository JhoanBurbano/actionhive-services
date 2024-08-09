const projectService = require('../services/projects.service');
const userServices = require('../services/user.service');

const getProjects = async (req, res) => {
    const response = await projectService.getProjects();
    res.status(response.status).json(response);
}

const getUserProjects = async (req, res) => {
    const response = await projectService.getUserProjects(req.user._id);
    res.status(response.status).json(response);
}

const getProjectsRecomended = async (req, res) => {
    const role = req.params.role;
    if (role !== 'investor' && role !== 'user') {
        return res.status(400).json({ message: "El rol debe ser 'investor' o 'user'" });
    }
    let response;
    if(role === 'investor') {
    response = await projectService.getProjectsRecomended(req.user._id);
    } else {
    response = await projectService.getUsersReccomendations(req.user._id);
    }
    res.status(response.status).json(response);
}

const getProject = async (req, res) => {
    const response = await projectService.getProject(req.params.id);
    res.status(response.status).json(response);
}

const createProject = async (req, res) => {
    const response = await projectService.createProject({...req.body, representant: req.user._id, team: [req.user._id]});
    console.log('response :>> ', response);
    try {
        await userServices.addProjectToUser(req.user._id, response.data._id);
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al crear el proyecto, intenta de nuevo", error: error.message || error});
    }
    res.status(response.status).json(response); 
}

const updateProject = async (req, res) => {
    const response = await projectService.updateProject(req.params.id, req.body);
    res.status(response.status).json(response);
}

const deleteProject = async (req, res) => {
    const response = await projectService.deleteProject(req.params.id);
    try {
        await userServices.removeProjectFromUser(req.user._id, req.params.id);
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al eliminar el proyecto, intenta de nuevo", error: error.message || error});
    }
    res.status(response.status).json(response);
}

module.exports = {
    getProjects,
    getUserProjects,
    getProjectsRecomended,
    getProject,
    createProject,
    updateProject,
    deleteProject
};
