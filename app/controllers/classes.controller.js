const mysql = require('mysql');
const express = require('express');
const app = express();
const { v4: uuidv4 } = require("uuid");
// connection configurations
// const connection = mysql.createConnection({
//   host: 'sql12.freemysqlhosting.net',
//   user: 'sql12624494',
//   password: '5Qjd2tNwqT',
//   database: 'sql12624494', // tên database (nếu có)
//   port: 3306,
// });
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'room'
});

var admin = require("firebase-admin");

var serviceAccount = require("/webdemo/webdemo-d1191-firebase-adminsdk-6ebpi-81b5c8b628.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webdemo-d1191-default-rtdb.firebaseio.com/"
}, 'classes-app');
// connect to database
connection.connect(function (err) { 
    if (err) throw err
    console.log('You are now connected with mysql database...')
})

exports.getStudentsByclassesId = (req, res) => {
  const classesId = req.params.id; 
  const getStudentsQuery = `SELECT users.name, users.email
                            FROM links
                            INNER JOIN classes ON links.classes_id = classes.id
                            INNER JOIN users ON links.users_id = users.id 
                            WHERE links.classes_id = ${classesId}`;

  connection.query(getStudentsQuery, (error, results) => {
      if (error) throw error;

      return res.json({
          data: results
      });
  });
};
