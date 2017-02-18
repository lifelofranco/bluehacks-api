module.exports = function(mongoose)
{

    var config = require('../../utils/constants')
    var jwt = require('jsonwebtoken');

    var UserSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        firstName: String,
        middleName: String,
        lastName: String,
        password: String,
        email: String,
        birthday: { type: Date },
        photo: String,
        phone: String,
        applications: []
//        createdAt: { type: Date, default: Date.now },
    });

    return module.exports = mongoose.model('users', UserSchema);
};
