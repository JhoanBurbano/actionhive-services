const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({status: 'OK'});
});


require('./src/services/mongo.service.js');

require('./src/routes/index.js')(app);



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;