const nodemailer = require('nodemailer');

const crypto = require('crypto')
module.exports={
    vaildObjectApi: async function (required, non_required, res) {
        let message = '';
        let empty = [];

        for (let key in required) {
            if (required.hasOwnProperty(key)) {
                if (required[key] == undefined || required[key] === '' && (required[key] !== '0' || required[key] !== 0)) {
                    empty.push(key);
                }
            }
        }

        if (empty.length != 0) {
            message = empty.toString();
            if (empty.length > 1) {
                message += " fields are required"
            } else {
                message += " field is required"
            }
            throw {
                'code': 400,
                'message': message
            }
        } else {

            const merge_object = Object.assign(required, non_required);

            if (merge_object.hasOwnProperty('password') && merge_object.password == '') {
                delete merge_object.password;
            }

            for (let data in merge_object) {
                if (merge_object[data] == undefined) {
                    delete merge_object[data];
                } else {
                    if (typeof merge_object[data] == 'string') {
                        merge_object[data] = merge_object[data].trim();
                    }
                }
            }

            return merge_object;
        }
    },

    success: function (res, message = '', body = {}) {
        return res.status(200).json({
            'success': true,
            'code': 200,
            'message': message,
            'body': body
        });
    },

    error: function (res, err, req) {
        console.log(err, '===========================>error');
       
        let code = (typeof err === 'object') ? (err.code) ? err.code : 403 : 403;
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;

        return res.status(code).json({
            'success': false,
            'message': message,
            'code': code,
            'body': {}
        });

    },
    bcryptHash: (myPlaintextPassword, saltRounds = 10) => {
        const bcrypt = require('bcrypt');
        const salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(myPlaintextPassword, salt);
        hash = hash.replace('$2b$', '$2y$');
        return hash;
    },

    sendEmail(object) {
        try {
            mailAuth = {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                service: 'gmail',
                auth: {
                  user: 'test123@gmail.com',
                  pass: 'password'
                }
              };
            var transporter = nodemailer.createTransport(mailAuth);

            transporter.sendMail(object, function (error, info) {
                if (error) {
                    console.log('error', error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch (err) {
            throw err;
        }
    },
    createSHA1: function () {
        let key = 'abc' + new Date().getTime();
        return crypto.createHash('sha1').update(key).digest('hex');
    },
}