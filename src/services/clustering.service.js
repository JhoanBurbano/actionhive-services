// clustering.service.js

const {kmeans} = require('ml-kmeans');
const cosineSimilarity = require('compute-cosine-similarity');  // Librería para calcular similitud de coseno


function extractFeatures(project) {
  return {
    fundingCap: project.fundingCap,
    projectRiskCalculation: project.projectRiskCalculation,
    returnRate: project.returnRate,
  };
}

function extractInvestorPreferences(investor) {
  return {
    fundingCap: investor.preferences.fundingCap,
    riskTolerance: investor.preferences.riskTolerance,
    expectedReturnRate: investor.preferences.expectedReturnRate,
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
  const { bestClusterIndex } = findClosestCluster(investorPreferences, clusters);

  
  const recommendedProjects = projects.filter((project) => project.cluster === bestClusterIndex);


  return recommendedProjects;
}

function findClosestCluster(preferences, clusters) {
  const centroids = clusters.centroids
  const investorPreferences = Object.values(preferences);
  let bestClusterIndex = -1;
  let highestSimilarity = -1;

  centroids.forEach((centroid, index) => {
    const similarity = cosineSimilarity(investorPreferences, centroid);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestClusterIndex = index;
    }
  });

  return { bestClusterIndex, highestSimilarity };
}

module.exports = {
  transformProjectData,
  clusterProjects,
  recommendProjects
};
