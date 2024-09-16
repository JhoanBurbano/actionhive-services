const toProjectView = (project) => {
  project = Array.isArray(project) ? project : [project];

  return project.map((project) => {
    project = project.toObject();
    delete project["cluster"];
    return {
      id: project._id,
      projectName: project.projectName,
      description: project.description,
      developmentStatus: project.developmentStatus,
      fundingCap: project.fundingCap,
      team: project.team.map((user) => {
        return {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        };
      }),
      representant: {
        id: project.representant?._id,
        firstname: project.representant?.firstname,
        lastname: project.representant?.lastname,
        email: project.representant?.email,
      },
    };
  });
};

const toProjectDetail = (project) => {
    project = project.toObject();
    // delete project["cluster"];
    delete project["__v"];
  return {
    id: project._id,
    ...project,
    team: project.team.map((user) => {
      return {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };
    }),
    representant: {
      id: project.representant._id,
      firstname: project.representant.firstname,
      lastname: project.representant.lastname,
      email: project.representant.email,
    },
  };
};

module.exports = {
  toProjectView,
  toProjectDetail
};
