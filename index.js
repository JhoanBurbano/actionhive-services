const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const Project = require('./src/models/project.model');
const { clusterProjects } = require('./src/services/recomendations.js');
const { runUpdateProjects, runUpdateUsers, runUpdateInvestors } = require('./src/services/scripts.services.js');
const userModel = require('./src/models/user.model.js');
const investorModel = require('./src/models/investor.model.js');



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({status: 'OK'});
});

// app.get("/", async (_, res)=>{
//     try {
//         // console.log('clusterProjects :>> ')
//         // await clusterProjects();
//         // return res.json(await Project.find({ fundingCap: {$gt: 80000000}}));
//         // await runUpdateProjects();
//         // await runUpdateUsers();
//         await runUpdateInvestors();
//         // return res.json(await Project.find());
//         return res.json(await investorModel.find());
//         return res.json(await userModel.find());
//         res.json([((await Project.find({cluster: 0})).length), ((await Project.find({cluster: 1})).length), ((await Project.find({cluster: 2})).length)]);
//     } catch (error) {
//         console.log('error :>> ', error);
//         res.status(500).json({error: error});
//     }
// })


require('./src/services/mongo.service.js');

require('./src/routes/index.js')(app);



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;