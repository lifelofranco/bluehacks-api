module.exports = function(app, router, db, constants) {
    var LRNClass = db.lrnClass;
    var newClass = new LRNClass();

    var http = require('http');
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var jwt = require('jsonwebtoken');

    var excludedFields = {
        password: 0
    };

    // For local login
    router.get('/' + constants.class_prefix, function (req, res) {
        console.log('GET: /api/v1/classes');

        LRNClass.find(function (err, classes) {
            return res.json(classes);
        });
    });

    router.get('/' + constants.class_prefix + '/:id', function (req, res) {
        console.log('GET: /api/v1/classes/:id');

        LRNClass.findOne({_id: req.params.id},function (err, fetchedClass) {
            return res.json(fetchedClass);
        });
    });

    // For local login
    router.post('/' + constants.class_prefix + '/' + constants.create_prefix, function(req,res) {
      console.log('POST: /api/v1/classes/create');

      LRNClass.findOne({ 'title' : req.body.title }, function(err, foundClass) {

          if (foundClass) {
              console.log('POST: /api/v1/users/register - found class ' + foundClass);
              return res.json({ status_code: 500, message : "Class Name Already Existing." });
          } else {
            newClass = new LRNClass();


            newClass._id = mongoose.Types.ObjectId();
            newClass.title = req.body.title;
            newClass.description = req.body.description;
            newClass.image = req.body.image;
            newClass.date = req.body.date;
            newClass.classTickets = req.body.classTickets;
            newClass.schedule = req.body.schedule;

            newClass.tickets = req.body.tickets;
            newClass.mentor = req.body.mentor;
            newClass.tags = req.body.tags;

            newClass.venue = req.body.venue;
            newClass.streetAddress = req.body.streetAddress;
            newClass.city = req.body.city;
            newClass.country = req.body.country;
            newClass.postalCode = req.body.postalCode;

            LRNClass.create(newClass, function(err, createdClass){
                  if(err) {
                      console.log('Register POST - Did not create class');
                      console.log(err);
                      return res.json({ status_code: 500, message : err });
                  } else {
                      return res.json({ message : 'Class Registered!' });
                  }
            });
          }
      })



    });

    // For local registration
    router.delete('/' + constants.class_prefix + '/' + constants.delete_prefix, function(req,res) {
      console.log('DELETE /api/v1/classes/delete');
      console.log('DELETE: /api/v1/classes/delete - req.body = ', req.body);

      LRNClass.findOneAndRemove({_id: req.body.classId}, function (err, deletedClass) {
          if(err) {
              console.log('DELETE Class - Did not delete class');
              console.log(err);
              return res.json({ status_code: 500, message : err });
          } else {
              return res.json({ message : 'Class Deleted!' });
          }
      });


    });

    // For confirming user
    router.post('/' + constants.class_prefix + '/' + constants.edit_prefix, function(req,res) {
      console.log('POST: /api/v1/classes/edit');
      console.log(req.body);

      LRNClass.update({_id: req.body.classId}, {$set: req.body}, function(err, updatedClass){
          if (err) {
              console.log('POST: /api/v1/classes/edit - ERROR = ', err);
              return res.status(500).json({message : "Editing not successful... ERROR: " + err });
          } else {
              return res.json({ message : "Editing of Class successful!"});
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
