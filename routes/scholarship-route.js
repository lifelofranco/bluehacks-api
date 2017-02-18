module.exports = function(app, router, db, constants) {
    var Scholarships = db.scholarships;
    var scholarship = new Scholarships();

    var http = require('http');
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var jwt = require('jsonwebtoken');

    var excludedFields = {
        password: 0
    };
    router.get('/' + constants.scholarship_prefix + '/:id', function (req, res) {
        console.log('GET: /api/v1/scholarships/:id');

        Scholarships.findOne({_id: req.params.id},function (err, fetchedClass) {
            return res.json(fetchedClass);
        });
    });

    router.get('/' + constants.scholarship_prefix, function (req, res) {
        console.log('GET: /api/v1/scholarships');

        Scholarships.find(function (err, scholarships) {
            return res.json(scholarships);
        });
    });


    // Creating scholarships
    router.post('/' + constants.scholarship_prefix + '/' + constants.create_prefix, function(req,res) {
      console.log('POST: /api/v1/scholarships/create');

      scholarship = new Scholarships();

      scholarship._id = mongoose.Types.ObjectId();
      scholarship.name = req.body.name;
      scholarship.institution = req.body.institution;
      scholarship.logo = req.body.logo;
      scholarship.description = req.body.description;
      scholarship.requirements = req.body.description;
      scholarship.files = req.body.description;
      // scholarship.applications = req.body.applications;
      

      Scholarships.create(scholarship, function(err, createdClass){
            if(err) {
                console.log('Register POST - Did not create scholarship');
                console.log(err);
                return res.json({ status_code: 500, message : err });
            } else {
                return res.json({ message : 'Scholarship Registered!' });
            }
      });

    });

    // For deleting scholarships
    router.delete('/' + constants.scholarship_prefix + '/' + constants.delete_prefix, function(req,res) {
      console.log('DELETE /api/v1/scholarships/delete');
      console.log('DELETE: /api/v1/scholarships/delete - req.body = ', req.body);

      Scholarships.findOneAndRemove({_id: req.body.scholarshipId}, function (err, deletedMentor) {
          if(err) {
              console.log('DELETE Mentor - Did not delete scholarship');
              console.log(err);
              return res.json({ status_code: 500, message : err });
          } else {
              return res.json({ message : 'Mentor Deleted!' });
          }
      });


    });

    // For editing scholarships
    router.post('/' + constants.scholarship_prefix + '/' + constants.edit_prefix, function(req,res) {
      console.log('POST: /api/v1/scholarships/edit');
      console.log(req.body);

      Scholarships.update({_id: req.body.scholarshipId}, {$set: req.body}, function(err, updatedMentor){
          if (err) {
              console.log('POST: /api/v1/scholarships/edit - ERROR = ', err);
              return res.status(500).json({message : "Editing not successful... ERROR: " + err });
          } else {
              return res.json({ message : "Editing of scholarship successful!"});
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
