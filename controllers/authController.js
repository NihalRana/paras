
const { where } = require('sequelize');
const helper = require('../helper/helper')
const db = require('../db/db')

const jwt = require('jsonwebtoken');


module.exports = {
    signup: async (req, res) => {
        try {
            const required = {                
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                role:req.body.role || 1,
            };

            const nonRequired = {};

            let requestData = await helper.vaildObjectApi(required, nonRequired);
            let check_email = await db.users.findOne({
                where:{
                email: requestData.email,
                }
            }) // check email

            if(requestData.password != requestData.confirmPassword) throw 'confirmPassword not match with password';

            if (check_email) throw 'Email already registered ';

            if (requestData.hasOwnProperty('password') && requestData.password) {
                requestData.password = await helper.bcryptHash(requestData.password);
            }
            var user = await db.users.create(requestData) // create user
            
            let userData = {
                id: user.id,
                email: user.email,
            }
            
            let token = jwt.sign({ data: userData }, "secretKey"); // user token created
            user.token = token;

            return helper.success(res, 'User registered successfully', user); 

        } catch (err) {
            return helper.error(res, err);
        }
    },

    login: async (req, res) => {
        try {
            const required = {                
                email: req.body.email,
                password: req.body.password,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObjectApi(required, nonRequired);

            let getUser = await db.user.findOne({where: {
                email: requestData.email
            }});
            
            if (!getUser) throw "Email did not match, Please try again.";

                 if (! await bcrypt.compare(requestData.password, getUser.password)) throw "Email or Password did not match, Please try again.";

            let userData = {
                id: getUser.id,
                email: getUser.email,
            }
            
            let token = jwt.sign({
                data: userData
            }, secretKey);
            
            getUser.save();     
            getUser.token = token;
         
            
            return helper.success(res, 'User logged in successfully.', getUser);
        } catch (err) {
            return helper.error(res, err);
        }
    },


    forgotPassword: async (req, res) => {
        try {
            const required = {                
                email: req.body.email,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObjectApi(required, nonRequired);

            var userData = await db.users.findOne({
                where:{
                    email:requestData.email
                }
            })
            
            if (!userData) throw "Email does not exist.";
            userData.rememberToken = helper.createSHA1();
            userData.save();
            
            var object = {
                mail: {
                    to: userData.email,
                    subject: 'Forgot Password',
                    user: {
                        link: req.protocol + "://" + req.get('host') + "/users/resetPassword/" + userData.rememberToken,
                    }
                },
                htmlCode: "apiEmailTemplates/forgotPassword"
            };
            let user = await helper.sendEmailData(object);

            return helper.success(res, 'Email has been sent to your registered email.', {});
        } catch (err) {
            return helper.error(res, err);
        }
    },
    forgotResetUrl: async (req, res) => {
        try {
            
            let user = await db.users.findOne({where: {
                rememberToken: req.params.rememberToken,
            }})

            if (user) {
                res.render("apiEmailTemplates/resetPassword", {
                    title: "Reset Password",
                    response: user,
                    rememberToken: req.params.rememberToken,
                });
            } else {
                res.render("apiEmailTemplates/error", {
                    msg: "Oops, this link is expired"
                });
            }
        } catch (err) {
            throw err;
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password, rememberToken } = { ...req.body };
        
            const user = await db.users.findOne({
                where: {
                    rememberToken
                },
            });
            if (!user) throw "Oops, this link is expired.";
        
            user.password = await helper.bcryptHash(password);
            user.rememberToken = "";
            user.save();
        
        
            if (user) {
                res.render("apiEmailTemplates/successPage", {
                    title: "paras",
                    msg: "Password Changed successfully",
                });
            } else {
                throw "Invalid user";
            }
        } catch (err) {
            if (typeof err === "string") {
                res.render("apiEmailTemplates/successPage", {
                    msg: err,
                });
            } else {
                console.log(err);
            }
        }
    },
}