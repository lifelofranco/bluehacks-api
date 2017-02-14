module.exports = function(mongoose)
{

    var config = require('../../utils/constants')
    var jwt = require('jsonwebtoken');

    var UserSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        accountType: Number,
        verified: Boolean,
        firstName: String,
        lastName: String,
        password: String,
        email: String,
        classes: [],
        tickets: [],
        createdAt: { type: Date, default: Date.now },
    });

    return module.exports = mongoose.model('users', UserSchema);
};
