module.exports = function(mongoose)
{
    var ScholarshipSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        name: String,
        institution: String,
        logo: String,
        description: String,
        requirements: [],
        files: [],
        application: []
});

    return module.exports = mongoose.model('scholarships', ScholarshipSchema);
};

// 58a843d35d325f3a641c212f
// 58a8525c5d5d0d319c720846