var express = require('express');
var router = express.Router();
var userSvc = require('../services/userService');
var messages = require('../Handlers/msg_handler');

router
    .post('/addUser', function (req, res, next)
    {

        userSvc.addUser(req, function (err, result)
        {

            if (err) {

                res.json({error: true, message: messages.RECORD_ERROR, description: '', data: err});

            } else {

                res.json({error: false, message: messages.RECORD_CREATED, description: '', data: result});

            }

        });

    })
    .get('/allUsers', function (req, res, next)
    {

        userSvc.getUsers(req, function (err, result)
        {

            if (err)
            {

                res.json({error: true, message: messages.RECORD_ERROR, description: '', data: err});

            } else
                {

                var response = (result && result.length>0) ?
                    {
                        error: false,
                        message: messages.GET_ALL_RECORDS,
                        description: '',
                        data: result
                    } : {error: true, message: messages.NO_RECORD, description: '', data: {}};

            }
            res.json(response);
        });

    })

    .post('/userLogin',function (req,res,next) {

        userSvc.login(req, function (err, userResult, matchResult) {

            if (err) {

                res.json({error: true, message: messages.RECORD_ERROR, description: '', data: err});

            } else {

                if(!userResult)
                {
                    res.json({error: true, message:'Invalid UserEmail', description: '', data: {}});
                }

                else
                {
                    if(!matchResult)
                    {
                        res.json({error: true, message: messages.WRONG_PASSWORD, description: '', data: err});
                    }
                    else
                    {
                        res.json({error: false, message: messages.CORRECT_PASSWORD, description: '', data: userResult});
                    }
                }

            }

        });
    });




module.exports = router;
