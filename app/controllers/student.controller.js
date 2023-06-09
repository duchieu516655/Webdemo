const mysql = require('mysql');
// connection configurations
const connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12624494',
  password: '5Qjd2tNwqT',
  database: 'sql12624494', // tên database (nếu có)
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
    if (!req.body.email) {
      return res.status(400).send({
        message: "email can not be empty"
      });
    }
    
    var params = req.body;
    console.log(params);
    const studentsRef = admin.firestore().collection('students');
      studentsRef.add(params)
      .then(docRef => {
        const dbRef = admin.database().ref('students');
          dbRef.push(params, function(error) {
          if (error) {
            throw error;
          } else {
            connection.query("INSERT INTO students SET ? ", params,
              function (error, results, fields) {
                if (error) throw error;
                return res.send({
                  data: {
                    firestoreId: docRef.id,
                    realtimeId: dbRef.key,
                    mysqlId: results.insertId
                  },
                  message: 'student has been created successfully.'
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
    connection.query('select * from students',
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
};
exports.findOne = (req, res) => {

    connection.query('select * from students where Id=?',
        [req.params.id],
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
};
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.description) {
        return res.status(400).send({
            message: "email can not be empty"
        });
    }

    console.log(req.params.id);
    console.log(req.body.description);
    connection.query('UPDATE `students` SET `name`=?,`email`=? where `id`=?',
        [req.body.name, req.body.description, req.params.id],
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
};
exports.delete = (req, res) => {
    console.log(req.body);
    connection.query('DELETE FROM `students` WHERE `Id`=?', 
        [req.body.id], function (error, results, fields) {
            if (error) throw error;
            res.end('a student disconneted');
    });
};