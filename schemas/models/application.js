module.exports = function(mongoose)
{
    var ApplicationSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        scholarshipId: String,
        scholarship: [],
        userId: String,
        submissions: [],
        applications: [],
        status: {type: String, default: "Pending"},
        appliedAt: { type: Date, default: Date.now }
    });

    return module.exports = mongoose.model('appClass', ApplicationSchema);
};
