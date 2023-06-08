const mysql = require('mysql');
const uuid = require('uuid');
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
}, 'teacher-app');
connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
})
exports.create = (req, res) => {
    if (!req.body.email) {
      return res.status(400).send({
        message: "email can not be empty"
      });
    }
    
    var params = req.body;
    console.log(params);
    const studentsRef = admin.firestore().collection('teachers');
    studentsRef.add(params)
      .then(docRef => {
        const dbRef = admin.database().ref('teachers');
  
        dbRef.push(params, function(error) {
          if (error) {
            throw error;
          } else {
            connection.query("INSERT INTO teachers SET ? ", params,
              function (error, results, fields) {
                if (error) throw error;
                return res.send({
                  data: {
                    firestoreId: docRef.id,
                    realtimeId: dbRef.key,
                    mysqlId: results.insertId
                  },
                  message: 'teacher has been created successfully.'
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
    connection.query('select * from teachers',
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
};
exports.findOne = (req, res) => {

    connection.query('select * from teachers where Id=?',
        [req.params.id],
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
};
exports.update = (req, res) => {
    if (!req.body.description) {
        return res.status(400).send({
            message: "email can not be empty"
        });
    }

    console.log(req.params.id);
    console.log(req.body.description);
    connection.query('UPDATE `teachers` SET `name`=?,`email`=? where `id`=?',
        [req.body.name, req.body.description, req.params.id],
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
};
exports.delete = (req, res) => {
    console.log(req.body);
    connection.query('DELETE FROM `teachers` WHERE `Id`=?', 
        [req.body.id], function (error, results, fields) {
            if (error) throw error;
            res.end('Record has been deleted!');
    });
};
exports.getStudentsByTeacherId = (req, res) => {
    const teacherId = req.params.id; 
    const getStudentsQuery = `SELECT students.name, students.email, students.phone ,teachers.name AS teacher_name
                              FROM links
                              INNER JOIN teachers ON links.teacher_id = teachers.id
                              INNER JOIN students ON links.student_id = students.id 
                              WHERE links.teacher_id = ${teacherId}`;

    connection.query(getStudentsQuery, (error, results) => {
        if (error) throw error;

        return res.json({
            data: results
        });
    });
};
