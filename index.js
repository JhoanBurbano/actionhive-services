const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');

const authMiddleware = require('./src/middlewares/auth.middleware.js');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({status: 'OK'});
});


app.use('/', authMiddleware);


app.get('/api/v1/hive-core-services', (req, res) => {});


app.post('/api/v1/hive-core-services', (req, res) => {});


app.put('/api/v1/hive-core-services', (req, res) => {});


app.delete('/api/v1/hive-core-services', (req, res) => {});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;