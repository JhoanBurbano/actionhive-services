// clustering.service.js

const {kmeans} = require('ml-kmeans');


// Modelos de Mongoose
const Investor = require('../models/investor.model');
const Project = require('../models/project.model');

// Extraer y preprocesar datos
async function fetchData() {
  const investors = await Investor.find().exec();
  const projects = await Project.find({ isActive: true }).exec();
  return { investors, projects };
}

function extractFeatures(project) {
  return {
    fundingCap: project.fundingCap,
    projectRiskCalculation: project.projectRiskCalculation,
    returnRate: project.returnRate,
    hasAI: project.hasAI ? 1 : 0,
  };
}

function transformProjectData(projects) {
  return projects.map(project => extractFeatures(project));
}

// Método del codo para encontrar el número óptimo de clusters
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

function euclideanDistance(vector1, vector2) {
  if (vector1?.length !== vector2?.length) {
    throw new Error('Los vectores deben tener la misma longitud');
  }
  return Math.sqrt(
    vector1.reduce((sum, val, index) => {
      return sum + Math.pow(val - vector2[index], 2);
    }, 0)
  );
}

// Algoritmo de clustering
async function clusterProjects(projectData) {
  const maxK = 10; // Puedes ajustar este valor según sea necesario
  const optimalK = findOptimalClusters(projectData, maxK);
  // Usar el k óptimo encontrado para realizar el clustering
  const vectors = projectData.map(project => Object.values(project));
  const clusters = kmeans(vectors, optimalK);
  return clusters;
}

// Recomendación de proyectos
async function recommendProjects(investor, clusters, projects) {
  const investorPreferences = extractInvestorPreferences(investor);
  const preferredCluster = findClosestCluster(investorPreferences, clusters);

  // Filtra proyectos dentro del cluster preferido
  const recommendedProjects = projects.filter((project, index) => {
    return project.cluster === preferredCluster;
  });


  return recommendedProjects;
}

function extractInvestorPreferences(investor) {
  return {
    fundingCap: investor.preferences.fundingCap,
    riskTolerance: investor.preferences.riskTolerance,
    expectedReturnRate: investor.preferences.expectedReturnRate,
  };
}

function findClosestCluster(preferences, clusters) {
  const centroids = clusters.centroids
  const preferenceVector = Object.values(preferences);
  let minDistance = Infinity;
  let closestClusterIndex = -1;

  centroids.forEach((centroid, index) => {
    const distance = euclideanDistance(preferenceVector, centroid);
    if (distance < minDistance) {
      minDistance = distance;
      closestClusterIndex = index;
    }
  });

  return closestClusterIndex;
}

module.exports = {
  fetchData,
  transformProjectData,
  clusterProjects,
  recommendProjects
};
