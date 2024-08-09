const router = require('express').Router();

const projectsController = require('../controllers/projects.controller.js');


router.get("/", projectsController.getProjects);
router.get("/user", projectsController.getUserProjects);
router.get("/recommendations/:role", projectsController.getProjectsRecomended);
router.get("/:id", projectsController.getProject);
router.post("/", projectsController.createProject);
router.put("/:id", projectsController.updateProject);
router.delete("/:id", projectsController.deleteProject);

module.exports = router;