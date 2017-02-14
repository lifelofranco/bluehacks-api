module.exports = function(mongoose)
{
    var ClassSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        title: String,
        description: String,
        maxSlots: Number,
        image: String,
        schedule: String,
        dates: [],
        venue: String,
        streetAddress: String,
        city: String,
        country: String,
        postalCode: String,
        classTickets: [],
        mentorId: String,
        tags: [],
        createdAt: { type: Date, default: Date.now }
    });

    return module.exports = mongoose.model('lrnClass', ClassSchema);
};
