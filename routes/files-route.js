module.exports = function(app, router, db, constants) {
    var http = require('http');
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var jwt = require('jsonwebtoken');

    var fs = require('fs');
    var fsPath = require('fs-path');


    router.post('/' + constants.forms_uri + '/upload', function (req, res) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        console.log("POST: " + '/api/v1/' + constants.forms_uri + '/upload');
          if (req.body.content) {
            var content = decodeBase64Image(req.body.content);
/*            FileOutputStream fos = new FileOutputStream("http://localhost:8180/forms");
            fos.write(Base64.decode(req.body.content, Base64.NO_WRAP));
            fos.close();*/

            //localhost:8180/forms
//            var completeFileName = "public/forms/AteneodeManila/FinancialAid/ApplicationForm.pdf";
            var completeFileName = "public/forms/" + req.body.filePath;
        //      var completeFileName = "public/forms/AteneodeManila/FinancialAid/122888/ApplicationForm.pdf";
            //"public/forms/hello.pdf";
//            var completeFileName = constants.photo_guides_uri + "/" + req.body.fileName;

            fsPath.writeFile(completeFileName, content, function(err){
              if(err) {
                res.json({error:400, message:"Photo Upload Error"});
              } else {
                console.log("Photo saved");
                return res.json({ message : "Upload completed!"});
              }
            });


          /*  fs.writeFile(completeFileName, content, function (err) {
                if (err) {
                    console.log(err);
                    res.json({error:400, message:"Photo Upload Error"});
                } else {
                    console.log("Photo saved");
                    return res.json({ message : "Upload completed!"});
                }

            });*/
          }
    });

    function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        var data = new Buffer(matches[2], 'base64');

        return data;
    }
};
