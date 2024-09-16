module.exports = function(app) {
    app.use('/api/access', require('./access.route'));
    app.use('/api/investors', require('../middlewares/auth.middleware'), require('./investors.route'));
    app.use('/api/projects', require('../middlewares/auth.middleware'), require('./projects.route'));
    app.use('/api/preferences', require('../middlewares/auth.middleware'), require('./preferences.route'));
}

 