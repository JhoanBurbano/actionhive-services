module.exports = function(app) {
    app.use('/api/access', require('./access.route'));
    app.use('/api/projects', require('../middlewares/auth.middleware'), require('./projects.route'));
}

