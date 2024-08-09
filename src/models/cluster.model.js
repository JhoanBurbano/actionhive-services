const { Schema, model } = require("mongoose");

const clusterSchema = new Schema({
    index: Number,
    centroid: [Number],
  });
  
module.exports = model('Cluster', clusterSchema);