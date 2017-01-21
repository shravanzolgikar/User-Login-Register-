var User = require('../models/userModel');
var Role = require('../models/userRole');
var roleValues = Role.userRoles;

exports.addUser = function (req,cb) {
    var userData = new User();
    userData.userEmail = req.body.userEmail;
    userData.password = req.body.password;
    userData.name = req.body.name;
    userData.role = req.body.role;
    //save and check error
    userData.save(function (err) {
        return cb(err,userData)
    });
};

exports.getUsers = function(req,cb){
  User.find({isActive:true}).lean().exec(function (err,user) {
      return cb(err,user);
  });
};

exports.login = function (req,cb)
{
    var userEmail = req.body.userEmail;
    var password = req.body.password;

    User.findOne({userEmail: userEmail.toLowerCase()},function(err,user)
    {
        if(err || !user)
        {
            return cb(err, user, null);
        }

        user.comparePassword(password,function(err,isMatch)
        {
            return cb(err, user, isMatch);
        });

    });
};