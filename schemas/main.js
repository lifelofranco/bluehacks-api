module.exports = function(mongoose) {
    //Load all models here
    var user = require('./models/user')(mongoose);
    var appClass = require('./models/application')(mongoose);
    var scholarships = require('./models/scholarships')(mongoose);

    return module.exports = {
        user: user,
        appClass: appClass,
        scholarships: scholarships,
    }
};
