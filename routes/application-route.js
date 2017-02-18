module.exports = function(app, router, db, constants) {
    var AppClass = db.appClass;
    var User = db.user;
    var Scholarship = db.scholarships;
    var newApp = new AppClass();

    var http = require('http');
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var jwt = require('jsonwebtoken');

    var excludedFields = {
        password: 0
    };

    // For local login
    router.get('/' + constants.app_prefix, function (req, res) {
        console.log('GET: /api/v1/application');

        AppClass.find(function (err, application) {
            return res.json(application);
        });
    });

    router.post('/' + constants.app_prefix + '/my', function (req, res) {
        console.log('GET: /api/v1/application/');

        AppClass.find({'userId': req.body.userId},function (err, fetchedClass) {
            return res.json(fetchedClass);
        });
    });

    // For creating applicaition
    router.post('/' + constants.app_prefix + '/' + constants.create_prefix, function(req,res) {
      console.log('POST: /api/v1/application/create');

      AppClass.findOne({ 'scholarshipId' : req.body.scholarshipId, 'userId': req.body.userId }, function(err, foundClass) {

          if (foundClass) {
              console.log('POST: /api/v1/users/register - found class ' + foundClass);
              return res.json({ status_code: 500, message : "Application Already Existing." });
          } else {
            newApp = new AppClass();

            newApp._id = mongoose.Types.ObjectId();
            newApp.scholarshipId = req.body.scholarshipId;
            newApp.userId = req.body.userId;
            newApp.appliedAt = req.body.appliedAt;


            // User.findOne({_id: userId}).populate('applications').exec(function(err, applications) {
            //   applications.push(newApp);
            // });

            // Scholarship.findOne({_id: newApp.scholarshipId}).populate('applications').exec(function(err, applications) {
            //   applications.push(newApp);
            // });

            AppClass.create(newApp, function(err, createdClass){
                  if(err) {
                      console.log('Register POST - Did not create class');
                      console.log(err);
                      return res.json({ status_code: 500, message : err });
                  } else {
                    Scholarship.findOne({_id: newApp.scholarshipId}, function(err, selectedClass) {

                      selectedClass.applications.push(createdClass);

                    });
                    User.findOne({_id: newApp.userId}, function(err, selectedClass) {

                      selectedClass.applications.push(createdClass);

                    });

                     return res.json({ message : 'Application Registered!' });
                  }
            });
          }
      })



    });


    //   router.post('/' + constants.app_prefix + '/' + constants.create_prefix, function(req,res) {
    //   console.log('POST: /api/v1/application/create');

    //   AppClass.findOne({ 'scholarshipId' : req.body.scholarshipId, 'userId': req.body.userId }, function(err, foundClass) {

    //       if (foundClass) {
    //           console.log('POST: /api/v1/users/register - found class ' + foundClass);
    //           return res.json({ status_code: 500, message : "Application Already Existing." });
    //       } else {
    //         newApp = new AppClass();

    //         newApp._id = mongoose.Types.ObjectId();
    //         newApp.scholarshipId = req.body.scholarshipId;
    //         newApp.userId = req.body.userId;
    //         newApp.userId = userId;
    //         newApp.appliedAt = req.body.appliedAt;

    //         // User.findOne({_id: userId}).populate('applications').exec(function(err, applications) {
    //         //   applications.push(newApp);
    //         // });

    //         // Scholarship.findOne({_id: newApp.scholarshipId}).populate('applications').exec(function(err, applications) {
    //         //   applications.push(newApp);
    //         // });

    //         AppClass.create(newApp, function(err, createdClass){
    //               if(err) {
    //                   console.log('Register POST - Did not create class');
    //                   console.log(err);
    //                   return res.json({ status_code: 500, message : err });
    //               } else {
    //                   return res.json({ message : 'Class Registered!' });
    //               }
    //         });
    //       }
    //   })



    // });

    // For deleting application
    router.delete('/' + constants.app_prefix + '/' + constants.delete_prefix, function(req,res) {
      console.log('DELETE /api/v1/application/delete');
      console.log('DELETE: /api/v1/application/delete - req.body = ', req.body);

      AppClass.findOneAndRemove({_id: req.body.appId}, function (err, deletedClass) {
          if(err) {
              console.log('DELETE Class - Did not delete class');
              console.log(err);
              return res.json({ status_code: 500, message : err });
          } else {
              return res.json({ message : 'Class Deleted!' });
          }
      });


    });

    // For editing application
    router.post('/' + constants.app_prefix + '/' + constants.edit_prefix, function(req,res) {
      console.log('POST: /api/v1/application/edit');
      console.log(req.body);

      AppClass.update({_id: req.body.classId}, {$set: req.body}, function(err, updatedClass){
          if (err) {
              console.log('POST: /api/v1/application/edit - ERROR = ', err);
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
