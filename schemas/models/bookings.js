module.exports = function(mongoose)
{
    var BookingSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        reservation: [],
        confirmed: [],
        createdAt: { type: Date, default: Date.now }
    });

    return module.exports = mongoose.model('booking', BookingSchema);
};
