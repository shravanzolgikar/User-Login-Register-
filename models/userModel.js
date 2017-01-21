var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Role = require('./userRole');
var roleValues = Role.userRoles;
var validator = require('validator');
var bcrypt  = require('bcrypt');
SALT_WORK_FACTOR = 10;
var uniqueValidator = require('mongoose-beautiful-unique-validation');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var UserSchema = Schema({
    userEmail : {
        type: String,
        required : [true, 'please enter UserEmail-ID'],
        unique : 'userEmail already exists',
        index : true,
        lowercase : true,
        validate : [ validator.isEmail,'Invalid Email format']
    },
    password: {
        type : String,
        required : [true,'please provide your password']
    },
    name: {
        type:String,
        required : [false]
    },
    role :{
        type :String, required:[true,'please enter role'],
        validate: ({
            validator: function(val) {
                return( (val == roleValues.Admin) || (val == roleValues.Organizer) || (val == roleValues.TeamCap) ||
                (val == roleValues.TeamPlayer) || (val == roleValues.Donor))
            },
            message: 'Role does not exist'
        })},
    isActive : {type: Boolean, required: true, default: true},
    createdDate: {type: Date, required: true, default: Date.now},
    modifiedDate: {type: Date, required: false}
});
//==============Adding Hashing to the password=====================================//
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt)
    {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(deepPopulate);
module.exports = mongoose.model('User', UserSchema);
