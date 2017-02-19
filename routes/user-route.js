module.exports = function(app, router, db, constants) {
    var User = db.user;
    var user = new User();

    var http = require('http');
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var jwt = require('jsonwebtoken');

    var excludedFields = {
        password: 0
    };

    // For local login
    router.get('/' + constants.user_prefix, function (req, res) {
        console.log('GET: /api/v1/users');
        console.log('Body : ' + req.body);

        User.find(function (err, users) {
            return res.json(users);
        });
    });

    router.get('/' + constants.user_prefix + '/:id', function (req, res) {
        console.log('GET: /api/v1/user/:id');

        User.findOne({_id: req.params.id},function (err, fetchedClass) {
            return res.json(fetchedClass);
        });
    });

    // For local login
    router.post('/' + constants.user_prefix + '/login', function(req,res) {
      console.log('POST: /api/v1/users/login');
      console.log(req.body);

      var email = req.body.email;
      var password = req.body.password;

      User.findOne({ 'email' : email }, function(err, user) {
          if (err) {
              return res.json(err);
          }

          // If user found:
          if (user) {
              // if (user.verified) {
              //
              // } else {
              //     return res.json({ status_code: 500, message: "User Not Verified"});
              // }

              var validity = bcrypt.compare(password, user.password, function(err, valid) {
                  if (err) return res.json(err);

                  if (valid) {
                      console.log("Login POST - Validity function - User Validated");

                      delete user.applications;
                      var token = generateToken(user);
                      res.json({
                          message: "User now Logged In!",
                          token: token
                      });
                  } else {
                      console.log("Login POST - Validity function - Not Authenticated");
                      return res.status(500).json({message: "Wrong Password"});
                  }
              });

          } else {
              console.log("Login POST - User not found");
              return res.status(500).json({message: "Email not registered"});
          }

      });
    });

    // For local registration
    router.post('/' + constants.user_prefix + '/register', function(req,res) {
      console.log('POST: /api/v1/users/register');
      console.log('POST: /api/v1/users/register - req.body = ', req.body);

      var email = req.body.email;
      var password = req.body.password;
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;

      console.log('POST: /api/v1/users/register - Before query email = ' + email + ', password = ' + password);

      User.findOne({ 'email' : email }, function(err, user) {
          console.log('POST: /api/v1/users/register - found email ' + email);
          if (err) {
              console.log('Register POST ERROR = ', err)
              return res.json(err);
          }

          if (!email || !password) {
              console.log('Your username/password field is empty.');
              return res.json({ message : 'Your username/password field is empty.' });
          }

          if (user) {
              console.log('User is already existing.')
              return res.status(500).json({message : 'User already existing' });
            // return done(null, user);
          } else {
              user = new User();
              var hashedPass = createHash(password);
              user._id = mongoose.Types.ObjectId();
              user.firstName = firstName;
              user.lastName = lastName;
              user.email = email;
              user.password = hashedPass;
              user.account_type = 1; // Indicating User

              User.create(user, function(err, userObj){
                  if(err) {
                      // In this case, if there's already a registered email in database
                      // (from google registration), attach the password and save it in db.
                      console.log('Register POST - Did not create users');
                      console.log(err);
                      return res.status(500).json({ message : err });
                  } else {
                      return res.json({ message : 'User Registered!' });
                  }
            });
          }

      });
    });

    // updating user
    router.post('/' + constants.user_prefix + '/' + constants.edit_prefix, function(req,res) {
      console.log('POST: /api/v1/users/edit');
      console.log('POST: /api/v1/users/edit - req.body = ', req.body);

      var id = req.body.userId;
      console.log('Request body: ' + req.body.userId);
      User.update({_id: req.body.userId}, {$set: req.body}, function(err, user){
        if(err){
            console.log('POST: /api/v1/user/edit - ERROR = ', err);
            return res.status(500).json({message : "Editing not successful... ERROR: " + err });
        } else {
            return res.json({message: "Updating of User successful!"});
        }
      });

    });

    // For confirming user
    router.post('/' + constants.user_prefix + '/confirm_user', function(req,res) {
      console.log('POST: /api/v1/users/login');
      console.log(req.body);

      var email = req.body.email;

      User.findOne({ 'email' : email }, function(err, user) {
          if (err) {
              return res.json(err);
          }

          // If user found:
          if (user) {
              user.verified = true;
              user.save(function(err){
                  if(err) {
                      res.status(500).json({ message: "ERROR: " + err});
                  } else {
                      res.json({message: "User is now verified!"});
                  }

              });
          } else {
              console.log("Login POST - User not found");
              return res.json({ status_code: 500, message: "Email not registered"});
          }

      });
    });

    router.delete('/' + constants.user_prefix + '/' + constants.delete_prefix, function(req,res) {
      console.log('DELETE /api/v1/users/delete');
      console.log('DELETE: /api/v1/users/delete - req.body = ', req.body);

      User.findOneAndRemove({_id: req.body.userId}, function (err, deletedClass) {
          if(err) {
              console.log('DELETE User - Did not delete user');
              console.log(err);
              return res.json({ status_code: 500, message : err });
          } else {
              return res.json({ message : 'User Deleted!' });
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
