module.exports = function(app, router, db, constants) {
    var Bookings = db.booking;
    var LRNClass = db.lrnClass;
    var User = db.user;

    var http = require('http');
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var jwt = require('jsonwebtoken');

    var excludedFields = {
        password: 0
    };

    // For local login
    router.get('/' + constants.booking_prefix, function (req, res) {
        console.log('GET: /api/v1/booking');

        Bookings.find(function (err, booking) {
            return res.json(booking);
        });
    });

    router.get('/' + constants.booking_prefix + '/:id', function (req, res) {
        console.log('GET: /api/v1/booking/:id');

        Bookings.findOne({_id: req.params.id},function (err, fetchedClass) {
            return res.json(fetchedClass);
        });
    });

    // For local login
    router.post('/' + constants.booking_prefix + '/' + constants.create_prefix, function(req,res) {
      console.log('POST: /api/v1/booking/create');

      var booking = new Bookings();



      User.findOne({_id:req.body.userId}, function(err, user){
          if(user){

            booking._id = mongoose.Types.ObjectId();
            booking.tickets = req.body.tickets;
            booking.classId = req.body.classId;
            booking.reservation = req.body.reservation;

            Bookings.create(booking, function(err, createdClass){
                if(err) {
                    console.log('Register POST - Did not create booking');
                    console.log(err);
                    return res.status(500).json({message : err });
                } else {

                    var ticketInfo = {
                        bookingId: booking._id,
                        tickets: req.body.tickets,
                        dateIssued: new Date(),
                        activated: false
                    };

                    user.tickets.push(ticketInfo);

                    user.save(function(err){
                        if (err){
                          console.log('Register POST saving tickets to user - unsuccessful');
                          console.log(err);
                          return res.status(500).json({message : err });
                        } else {
                          return res.json({ message : 'Booking Registered!' });
                        }
                    })

                }
            });
          } else {
            res.status(500).json({message: "No user found."});
          }
      })



    });

    // For local registration
    router.delete('/' + constants.booking_prefix + '/' + constants.delete_prefix, function(req,res) {
      console.log('DELETE /api/v1/booking/delete');
      console.log('DELETE: /api/v1/booking/delete - req.body = ', req.body);

      Bookings.findOneAndRemove({_id: req.body.bookingId}, function (err, deletedBooking) {
          if(err) {
              console.log('DELETE Booking - Did not delete booking');
              console.log(err);
              return res.json({ status_code: 500, message : err });
          } else {
              return res.json({ message : 'Booking Deleted!' });
          }
      });


    });

    // For confirming user
    router.post('/' + constants.booking_prefix + '/' + constants.edit_prefix, function(req,res) {
      console.log('POST: /api/v1/booking/edit');
      console.log(req.body);

      Bookings.update({_id: req.body.bookingId}, {$set: req.body}, function(err, updatedBooking){
          if (err) {
              console.log('POST: /api/v1/booking/edit - ERROR = ', err);
              return res.status(500).json({message : "Editing not successful... ERROR: " + err });
          } else {
              return res.json({ message : "Editing of Booking successful!"});
          }
      });

    });

    var createHash = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    };

    var generateToken = function (user) {
        return jwt.sign(user, constants.SECRET_CODE, {expiresIn: 3600 * 24 * 7});
    };
};
