const mysql = require('mysql');
// connection configurations
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'room'
});

// connect to database
connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
    
})
exports.create = (req, res) => {
    const { teacherId, studentId } = req.body; // Lấy dữ liệu từ request body
    console.log(req.body)
    // Lấy thông tin sinh viên theo teacher_id
    const getStudentsQuery = `SELECT students.name, students.email, students.phone 
                              FROM links 
                              INNER JOIN students ON links.student_id = students.id 
                              WHERE links.teacher_id = ${parseInt(teacherId)}`;

    connection.query(getStudentsQuery, (error, results) => {
        if (error) throw error;
        console.log(results);
    });

    // Tạo liên kết giữa giáo viên và sinh viên
    const createLinkQuery = `INSERT INTO links (teacher_id, student_id) VALUES (${parseInt(teacherId)}, ${parseInt(studentId)})`;
console.log(createLinkQuery)
    connection.query(createLinkQuery, (error, results) => {
        if (error) throw error;
        return res.send({
            data: results,
            message: 'Teacher and student have been linked successfully.'
        });
    });
};
exports.findAll = (req, res) => {
    connection.query('select * from links',
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
};
