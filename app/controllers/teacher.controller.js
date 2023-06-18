const mysql = require('mysql');
// const uuid = require('uuid');
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
var admin = require("firebase-admin");

var serviceAccount = require("/webdemo/webdemo-d1191-firebase-adminsdk-6ebpi-81b5c8b628.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webdemo-d1191-default-rtdb.firebaseio.com/"
}, 'teacher-app');
connection.connect(function (err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
exports.createClasses = (req, res) => {
  const theToken = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log(theToken)
  // Kiểm tra xác thực token và role của người dùng
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization.split(' ')[1]
  ) {
    return res.status(422).json({
      message: "Please provide a valid auth token"
    });
  }
  
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'the-super-strong-secrect');
  console.log(decoded)
  if (decoded.role !== 'teacher') {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  if (!req.body.name) {
    return res.status(400).send({
      message: "name can not be empty"
    });
  }

  // Generate a unique room ID for the class using UUIDv4
  const roomId = uuidv4();

  const params = {
    id: Math.floor(Math.random() * 1000000),
    name: req.body.name,
    room_url: `http://localhost:4000/room/${roomId}`
  };

  console.log(params);
  const studentsRef = admin.firestore().collection('classes');
  studentsRef.add(params)
    .then(docRef => {
      const dbRef = admin.database().ref('classes');
      dbRef.push(params, function(error) {
        if (error) {
          throw error;
        } else {
          connection.query("INSERT INTO classes SET ? ", params,
            function (error, results, fields) {
              if (error) throw error;
              return res.send({
                data: {
                  id: params.id,
                  name: params.name,
                  room_url: params.room_url,
                  firestoreId: docRef.id,
                  realtimeId: dbRef.key,
                  mysqlId: results.insertId
                },
                message: 'class has been created successfully.'
              });
            }
          );
        }
      });
    })
    .catch(error => {
      throw error;
    });
};
