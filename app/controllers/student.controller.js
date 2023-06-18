const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { signupValidation, loginValidation } = require('../../validator/Validation');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");;
// connection configurations
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

connection.connect((err) => {
  if (err) throw err;
  console.log('Đã kết nối với MySQL!');
});
var admin = require("firebase-admin");

var serviceAccount = require("/webdemo/webdemo-d1191-firebase-adminsdk-6ebpi-81b5c8b628.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webdemo-d1191-default-rtdb.firebaseio.com/"
}, 'my-app');

exports.create = (req, res) => {
  const { classesId, usersId } = req.body; // Lấy dữ liệu từ request body
  console.log(req.body)
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
  if (decoded.role !== 'student') {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
  const getStudentsQuery = `SELECT users.name, users.email 
                            FROM links 
                            INNER JOIN users ON links.users_id = users.id 
                            WHERE links.classes_id = ${parseInt(classesId)}`;

  connection.query(getStudentsQuery, (error, results) => {
      if (error) throw error;
      console.log(results);
  });

  // Tạo liên kết giữa giáo viên và sinh viên
  const createLinkQuery = `INSERT INTO links (classes_id, users_id) VALUES (${parseInt(classesId)}, ${parseInt(usersId)})`;
console.log(createLinkQuery)
  connection.query(createLinkQuery, (error, results) => {
      if (error) throw error;
      return res.send({
          data: results,
          message: 'class and student have been linked successfully.'
      });
  });
};