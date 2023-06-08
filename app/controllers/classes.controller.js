const mysql = require('mysql');
const express = require('express');
const app = express();
const { v4: uuidv4 } = require("uuid");
// connection configurations
const connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12624494',
  password: '5Qjd2tNwqT',
  database: 'sql12624494', // tên database (nếu có)
  port: 3306,
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
exports.create = (req, res) => {
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
        teacher_id: req.body.teacher_id,
        room_url: `http://localhost:4000/room/${roomId}` // Add the WebRTC URL to the new class record
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
exports.findAll = (req, res) => {
    connection.query('select * from classes',
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
};
exports.getTeachersByTeacherId = (req, res) => {
    const your_class_id = req.params.id; 

    // Lấy thông tin học sinh được liên kết với giáo viên theo ID
    const getTeacherQuery = `SELECT teachers.* 
                          FROM classes 
                          INNER JOIN teachers ON classes.teacher_id = teachers.id
                          WHERE classes.id = ${your_class_id};`;

    connection.query(getTeacherQuery, (error, results) => {
        if (error) throw error;
        return res.json({
            data: results
        });
    });
    console.log(getTeacherQuery);
};
