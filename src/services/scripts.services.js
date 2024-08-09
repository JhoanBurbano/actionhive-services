const User = require("../models/user.model");
const Project = require("../models/project.model");
const faker = require("faker");
const projectsData = require("../../updated_projects.json");
const usersData = require("../../users.json");
const InvestorsData = require("../../investors.json");
const investorModel = require("../models/investor.model");

const getUsersWithoutProjects = async () => {
  try {
    const users = await User.find({ projects: { $size: 0 } });
    // const users = await User.find();
    return users;
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
};

const getProjectsWithoytRepresentant = async () => {
  try {
    const projects = await Project.find({ representant: { $exists: false } });
    return projects;
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
};

const assignRepresentantToProject = async (projectId, userId) => {
  try {
    await Project.findByIdAndUpdate(projectId, {
      representant: userId,
      $push: { team: userId },
    });
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
};

const assignProjectsToUser = async (userId, projectIds) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $push: { projects: { $each: projectIds } },
    });
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
};

const getRandomNumber = () => {
  return Math.floor(Math.random() * 3) + 1;
};

const getRandomElementsFromArray = (array, numElements) => {
  const randomElements = [];
  for (let i = 0; i < numElements; i++) {
    randomElements.push(array[Math.floor(Math.random() * array.length)]);
  }
  return randomElements;
};

const deleteRepresnetantAndClearProjects = async () => {
  try {
    await User.updateMany({}, { $set: { projects: [] } });
    await Project.updateMany(
      {},
      { $unset: { representant: 1 }, $set: { team: [] } }
    );
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
};

const runScript = async () => {
  try {
    // await Project.find({representant: { $exists: false }}).then(projects => console.log('projects :>> ', projects.length));
    // return
    // const usersWithoutProjects = await getUsersWithoutProjects()
    // .then(users => console.log('users :>> ', users.length));
    // usersWithoutProjects.forEach(async (user) => {
    //     try {
    //         const projectsWithoutRepresentant = await getProjectsWithoytRepresentant();
    //         const randomNumProjects = getRandomNumber();
    //         const randomProjects = getRandomElementsFromArray(projectsWithoutRepresentant, randomNumProjects);
    //         const projectIds = randomProjects.map(project => project._id);
    //         console.log('projectIds :>> ', projectIds);
    //         await assignProjectsToUser(user._id, projectIds);
    //         await assignRepresentantToProject(randomProjects[0]._id, user._id);
    //     } catch (error) {
    //         console.log('error on user for each:>> ', error);
    //         throw new Error(error);
    //     }
    // });
    // await deleteRepresnetantAndClearProjects()
    // return
    let projectsWithoutRepresentant = await getProjectsWithoytRepresentant();
    while (projectsWithoutRepresentant.length > 0) {
      const usersWithoutProjects = await getUsersWithoutProjects();
      const randomNumProjects = getRandomNumber();
      const randomProjects = getRandomElementsFromArray(
        projectsWithoutRepresentant,
        randomNumProjects
      );
      const projectIds = randomProjects.map((project) => project._id);
      const randomUser =
        usersWithoutProjects[
          Math.floor(Math.random() * usersWithoutProjects.length)
        ];
      await assignProjectsToUser(randomUser._id, projectIds);
      randomProjects.forEach(async (project) => {
        await assignRepresentantToProject(project._id, randomUser._id);
      });
      // await assignRepresentantToProject(randomProjects[0]._id, randomUser._id);
      projectsWithoutRepresentant = await getProjectsWithoytRepresentant();
    }
  } catch (error) {
    console.log("error :>> ", error);
  }
};

const riskLevels = ["Bajo", "Moderado", "Alto"];

const scriptUserPreferences = async () => {
  console.log("here");
  try {
    const projects = await Project.find();

    if (projects.length === 0) {
      throw new Error("No projects found in the database.");
    }

    // Obtener rangos de los proyectos
    const fundingCaps = projects.map((project) => project.fundingCap);
    const developmentStages = projects.map(
      (project) => project.developmentStatus
    );

    const minFundingCap = Math.min(...fundingCaps);
    const maxFundingCap = Math.max(...fundingCaps);

    const minDevelopmentStage = Math.min(...developmentStages);
    const maxDevelopmentStage = Math.max(...developmentStages);

    const users = await User.find();

    for (const user of users) {
      user.preferences = {
        preferredFundingCap: faker.random.number({
          min: minFundingCap,
          max: maxFundingCap,
        }),
        interestInAI: faker.random.boolean(),
        developmentStagePreference: faker.random.float({
          min: minDevelopmentStage,
          max: maxDevelopmentStage,
        }),
        riskTolerance:
          riskLevels[Math.floor(Math.random() * riskLevels.length)],
        locationPreference: faker.address.city(),
      };

      await user.save();
      console.log(
        `User ${user.firstname} ${user.lastname} updated with preferences.`
      );
    }
    console.log("User preferences script finished");
  } catch (error) {
    throw new Error(error);
  }
};

// const runUpdateProjects = async () => {
//   try {
//     const projects = projectsData;
//     for (const project of projects) {
//         const projectRiskCalculation = Math.random() * 100;
//       const projectFound = await Project.findByIdAndUpdate(project._id, {
//         projectRiskCalculation: project.projectRiskCalculation,
//         returnRate: project.returnRate,
//         returnPeriod: project.returnPeriod,
//       });
//       console.log(
//         `Project ${projectFound.projectName} updated with new values.`
//       );
//     }
//     console.log("Projects updated successfully");
//   } catch (error) {
//     throw new Error(error);
//   }
// };


const runUpdateProjects = async () => {
    try {
      const projects = projectsData;
      for (const project of projects) {
        let projectRiskCalculation, returnRate, returnPeriod;
  
        // Generar valores aleatorios dependiendo del nivel de riesgo
        switch (project.riskLevel) {
          case "Alto":
            projectRiskCalculation = Math.random() * 0.4 + 0.6; // Entre 0.6 y 1
            returnRate = Math.random() * 0.1 + 0.1; // Entre 0.1 y 0.2
            returnPeriod = Math.floor(Math.random() * 12) + 24; // Entre 24 y 35 meses
            break;
          case "Moderado":
            projectRiskCalculation = Math.random() * 0.3 + 0.3; // Entre 0.3 y 0.6
            returnRate = Math.random() * 0.1 + 0.05; // Entre 0.05 y 0.15
            returnPeriod = Math.floor(Math.random() * 12) + 12; // Entre 12 y 23 meses
            break;
          case "Bajo":
            projectRiskCalculation = Math.random() * 0.3; // Entre 0 y 0.3
            returnRate = Math.random() * 0.05; // Entre 0 y 0.05
            returnPeriod = Math.floor(Math.random() * 12) + 6; // Entre 6 y 17 meses
            break;
          default:
            throw new Error(`Unknown risk level: ${project.riskLevel}`);
        }
  
        const projectFound = await Project.findByIdAndUpdate(project._id, {
          projectRiskCalculation,
          returnRate,
          returnPeriod,
        });
  
        console.log(
          `Project ${projectFound.projectName} updated with new values.`
        );
      }
      console.log("Projects updated successfully");
    } catch (error) {
      throw new Error(error);
    }
  };

  const runUpdateUsers = async () => {
    try {
        const users = await User.find();
        await Promise.all(
            users.map(async (user, index) => {
                const preferences = usersData[index].preferences;
                const skills = usersData[index].skills;
                const interests = usersData[index].interests;
                const socialLinks = usersData[index].socialLinks;
                user.preferences = preferences;
                user.skills = skills;
                user.interests = interests;
                user.socialLinks = socialLinks;
                await user.save();
                console.log(`User ${user.firstname} ${user.lastname} updated with new preferences.`);
            }
        ))
        // for (const user of users) {
        //     const userFound = await User.findByIdAndUpdate(user._id, {
        //         preferences: user.preferences,
        //         skills: user.skills,
        //         interests: user.interests,
        //         socialLinks: user.socialLinks,
        //     });
        //     console.log(`User ${userFound.firstname} ${userFound.lastname} updated with new preferences.`);
        // }
    } catch (error) {
        throw new Error(error);
    }
  }


  const runUpdateInvestors = async () => {
    try {
        const investors = await investorModel.find();
        await Promise.all(
            investors.map(async (investor, index) => {
                const preferences = InvestorsData[index].preferences;
                const socialLinks = InvestorsData[index].socialLinks;
                investor.preferences = preferences;
                investor.socialLinks = socialLinks;
                await investor.save();
                console.log(`Investor ${investor.firstname} ${investor.lastname} updated with new preferences.`);
            }
        ))
        
    } catch (error) {
        throw new Error(error);
    }
  }


module.exports = {
  runScript,
  scriptUserPreferences,
  runUpdateProjects,
    runUpdateUsers,
    runUpdateInvestors,
};
