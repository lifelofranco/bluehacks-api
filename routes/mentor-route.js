module.exports = function(app, router, db, constants) {
    var Mentors = db.mentors;
    var mentor = new Mentors();

    var http = require('http');
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var jwt = require('jsonwebtoken');

    var excludedFields = {
        password: 0
    };

    // For local login
    router.get('/' + constants.mentor_prefix, function (req, res) {
        console.log('GET: /api/v1/mentor');

        Mentors.find(function (err, mentor) {
            return res.json(mentor);
        });
    });

    router.get('/' + constants.mentor_prefix + '/:id', function (req, res) {
        console.log('GET: /api/v1/mentor/:id');

        Mentors.findOne({_id: req.params.id},function (err, fetchedClass) {
            return res.json(fetchedClass);
        });
    });

    // For local login
    router.post('/' + constants.mentor_prefix + '/' + constants.create_prefix, function(req,res) {
      console.log('POST: /api/v1/mentor/create');

      mentor = new Mentors();

      mentor._id = mongoose.Types.ObjectId();
      mentor.name = req.body.name;
      mentor.photo = req.body.photo;
      mentor.description = req.body.description;
      mentor.credentials = req.body.credentials;

      Mentors.create(mentor, function(err, createdClass){
            if(err) {
                console.log('Register POST - Did not create mentor');
                console.log(err);
                return res.json({ status_code: 500, message : err });
            } else {
                return res.json({ message : 'Mentor Registered!' });
            }
      });

    });

    // For local registration
    router.delete('/' + constants.mentor_prefix + '/' + constants.delete_prefix, function(req,res) {
      console.log('DELETE /api/v1/mentor/delete');
      console.log('DELETE: /api/v1/mentor/delete - req.body = ', req.body);

      Mentors.findOneAndRemove({_id: req.body.mentorId}, function (err, deletedMentor) {
          if(err) {
              console.log('DELETE Mentor - Did not delete mentor');
              console.log(err);
              return res.json({ status_code: 500, message : err });
          } else {
              return res.json({ message : 'Mentor Deleted!' });
          }
      });


    });

    // For confirming user
    router.post('/' + constants.mentor_prefix + '/' + constants.edit_prefix, function(req,res) {
      console.log('POST: /api/v1/mentor/edit');
      console.log(req.body);

      Mentors.update({_id: req.body.mentorId}, {$set: req.body}, function(err, updatedMentor){
          if (err) {
              console.log('POST: /api/v1/mentor/edit - ERROR = ', err);
              return res.status(500).json({message : "Editing not successful... ERROR: " + err });
          } else {
              return res.json({ message : "Editing of Mentor successful!"});
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
