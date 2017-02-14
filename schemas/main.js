module.exports = function(mongoose) {
    //Load all models here
    var user = require('./models/user')(mongoose);
    var lrnClass = require('./models/class')(mongoose);
    var mentors = require('./models/mentors')(mongoose);
    var booking = require('./models/bookings')(mongoose);

    return module.exports = {
        user: user,
        lrnClass: lrnClass,
        mentors: mentors,
        booking: booking
    }
};
