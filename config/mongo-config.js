module.exports = function(mongoose, config, port)
{

	var url = process.env.MONGOLAB_URI ||
  			  process.env.MONGOHQ_URL ||

              // For Production DB. DO NOT USE!
              //'mongodb://'+ config.prod().username + ":" + config.prod().password + "@" + config.prod().host +
              //":" + config.prod().port + "/" + config.prod().database;


              // For Staging DB:
              // 'mongodb://'+ config.staging().username + ":" + config.staging().password + "@" + config.staging().host +
              // ":" + config.staging().port + "/" + config.staging().database;

              // For Local DB:
              'mongodb://'+ config.local().host +
              ":" + config.local().port + "/" + config.local().database;


    console.log(url);

    mongoose.connect(url, function(err) {
        if(err) {
            console.log('connection error', err);
        } else {
            console.log('connection successful');
        }
    });
};
