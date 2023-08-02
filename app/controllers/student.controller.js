const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { signupValidation, loginValidation } = require('../../validator/Validation');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
// connection configurations
// const connection = mysql.createConnection({
//   host: 'sql12.freemysqlhosting.net',
//   user: 'sql12627042',
//   password: 'ZB13rQ45mM',
//   database: 'sql12627042',
//   port: 3306,
// });
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'room'
});

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

exports.add = (req, res) => {
  const { name, email } = req.body;

  // Thực hiện truy vấn SQL để chèn thông tin học sinh vào bảng users
  const query = "INSERT INTO students SET ?";
  
  connection.query(query, { name, email }, (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo thông tin học sinh' });
      return;
    }

    res.status(201).json({ message: 'Thông tin học sinh đã được tạo thành công' });
  });
};

exports.create = (req, res) => {
  const { classesId, studentsId } = req.body; // Lấy dữ liệu từ request body
  console.log(req.body)
  
  const getStudentsQuery = `SELECT students.name, students.email 
                            FROM links 
                            INNER JOIN students ON links.students_id = students.id 
                            WHERE links.classes_id = ${parseInt(classesId)}`;

  connection.query(getStudentsQuery, (error, results) => {
      if (error) throw error;
      console.log(results);
  });

  // Tạo liên kết giữa giáo viên và sinh viên
  const createLinkQuery = `INSERT INTO links (classes_id, students_id) VALUES (${parseInt(classesId)}, ${parseInt(studentsId)})`;
console.log(createLinkQuery)
  connection.query(createLinkQuery, (error, results) => {
      if (error) throw error;
      return res.send({
          data: results,
          message: 'class and student have been linked successfully.'
      });
  });
};