const { kmeans } = require('ml-kmeans');
const cosineSimilarity = require('compute-cosine-similarity');
const User = require('../models/user.model');
const Project = require('../models/project.model');
const Cluster = require('../models/cluster.model');

// Función para convertir un usuario a un vector de preferencias
function convertUserToVector(user) {
  return [
    user.preferences.preferredFundingCap,
    user.preferences.riskTolerance,
    user.preferences.expectedReturnRate,
  ];
}

// Función para convertir un proyecto a un vector de características
function convertProjectToVector(project) {
  return [
    project.fundingCap,
    project.projectRiskCalculation,
    project.returnRate,
  ];
}
// Función para encontrar el número óptimo de clusters utilizando la Ley del codo
function findOptimalClusters(vectors, maxK) {
  const wcss = [];

  for (let k = 1; k <= maxK; k++) {
    const clusters = kmeans(vectors, k);
    const sumOfSquares = clusters.clusters.reduce((sum, cluster, idx) => {
      const diff = vectors[idx].map((val, i) => val - clusters.centroids[cluster][i]);
      return sum + diff.reduce((sum, val) => sum + val * val, 0);
    }, 0);
    wcss.push(sumOfSquares);
  }

  // Ley del codo: buscar el punto donde la reducción de WCSS se ralentiza
  let optimalK = 1;
  for (let i = 1; i < wcss.length - 1; i++) {
    if (wcss[i - 1] - wcss[i] > wcss[i] - wcss[i + 1]) {
      optimalK = i + 2;
      break;
    }
  }

  return optimalK;
}


// Función para agrupar proyectos
async function clusterProjects() {
  const projects = await Project.find();
  const projectVectors = projects.map(convertProjectToVector);

  const optimalK = findOptimalClusters(projectVectors, 10);
  console.log('optimalK :>> ', optimalK);
  const result = kmeans(projectVectors, optimalK);

  await Promise.all([
    ...projects.map(async (project, index) => {
      project.cluster = result.clusters[index];
      await project.save();
    }),
    ...result.centroids.map(async (centroid, index) => {
      const existingCluster = await Cluster.findOne({ index });
      if (existingCluster) {
        existingCluster.centroid = centroid;
        await existingCluster.save();
      } else {
        const newCluster = new Cluster({ index, centroid: centroid });
        await newCluster.save();
      }
    }),
  ]);

  return result;
}

// Función para encontrar el cluster más cercano
function findClosestCluster(userVector, centroids) {
  let closestCluster = -1;
  let closestDistance = -Infinity; // para cosine similarity, mayor es mejor

  centroids.forEach((centroid, index) => {
    // console.log({userVector, centroid})
    const distance = cosineSimilarity(userVector, centroid);
    if (distance > closestDistance) {
      closestCluster = index;
      closestDistance = distance;
    }
  });

  return closestCluster;
}

// Función para recomendar proyectos a un usuario
async function recommendProjects(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error(`User not found ${userId}`);

  const userVector = convertUserToVector(user);
  const clusters = await Cluster.find();
  const centroids = clusters.map((cluster) => cluster.centroid);

  // Encuentra el cluster más cercano
  const closestCluster = findClosestCluster(userVector, centroids);

  // Obtiene los proyectos en el cluster más cercano
  const projectsInCluster = await Project.find({ cluster: closestCluster })
    .populate({ path: 'representant', select: 'firstname lastname email' })
    .populate({ path: 'team', select: 'firstname lastname email' })
    .exec();

  // Filtra los proyectos basados en las preferencias del usuario
  const filteredProjects = projectsInCluster.filter(project => {
    return (
      (project.fundingCap <= user.preferences.preferredFundingCap) &&
      (project.returnRate >= user.preferences.expectedReturnRate || project.projectRiskCalculation <= user.preferences.riskTolerance)
    );
  });

  console.log('filteredProjects :>> ', filteredProjects.length, closestCluster);

  return filteredProjects;
}

// Función principal que integra todo
async function generateRecommendations(user_id) {
  const recommendations = await recommendProjects(user_id);
  // console.log('recommendari :>> ', recommendations);
  return recommendations;
}

module.exports = {generateRecommendations, clusterProjects};
