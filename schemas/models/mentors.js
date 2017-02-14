module.exports = function(mongoose)
{
    var MentorSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        name: String,
        photo: String,
        description: String,
        credentials: String,
        createdAt: { type: Date, default: Date.now }
    });

    return module.exports = mongoose.model('mentors', MentorSchema);
};
