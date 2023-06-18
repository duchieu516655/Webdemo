const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { signupValidation, loginValidation } = require('../../validator/Validation');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12627042',
  password: 'ZB13rQ45mM',
  database: 'sql12627042',
  port: 3306,
});
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root123',
//   database: 'room'
// });
connection.connect(function (err) {
  if (err) throw err
  console.log('You are now connected with mysql database users')
})
var admin = require("firebase-admin");

var serviceAccount = require("/webdemo/webdemo-d1191-firebase-adminsdk-6ebpi-81b5c8b628.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webdemo-d1191-default-rtdb.firebaseio.com/"
}, 'users-app');

exports.create = (req, res) => {
  console.log(req.body)
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "email and password can not be empty"
    });
  }

  const params = req.body;
  params.role = req.params.role; // Thêm trường role từ URL parameter vào payload của request body

  // Hash password before adding to database
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(params.password, salt, function (err, hash) {
      if (err) {
        throw err;
      }

      params.password = hash;

      const teachersRef = admin.firestore().collection('users');
      teachersRef.add(params)
        .then(docRef => {
          const dbRef = admin.database().ref('users');

          dbRef.push(params, function (error) {
            if (error) {
              throw error;
            } else {
              connection.query("INSERT INTO users SET ? ", params,
                function (error, results, fields) {
                  if (error) throw error;
                  return res.send({
                    data: {
                      firestoreId: docRef.id,
                      realtimeId: dbRef.key,
                      mysqlId: results.insertId,
                      role: params.role // Thêm trường role vào kết quả trả về
                    },
                    message: 'User has been created successfully.'
                  });
                }
              );
            }
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });
};
exports.login = (req, res, next) => {
  connection.query(
    `SELECT * FROM users WHERE email = ${connection.escape(req.body.email)};`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: 'Email or password is incorrect!'
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: 'Email or password is incorrect!'
            });
          }
          if (bResult) {
            const tokenPayload = { 
              id: result[0].id, 
              role: result[0].role
            };
            const token = jwt.sign(tokenPayload, 'the-super-strong-secrect', { expiresIn: '1h' });
            connection.query(
              `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
            );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
      );
    }
  );
};