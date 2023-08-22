const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set("view engine", "ejs");
const http = require('http');
const server = http.createServer(app);
var admin = require("firebase-admin");

var serviceAccount = require("./webdemo-d1191-firebase-adminsdk-6ebpi-81b5c8b628.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webdemo-d1191-default-rtdb.firebaseio.com/"
});
const database = admin.database();
var firestore=admin.firestore();
const settings={timestampsInSnapshots:true};
firestore.settings(settings);
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/main.ejs');
// });
const connectedRef = database.ref('.info/connected');
connectedRef.on('value', (snapshot) => {
    const isConnected = snapshot.val() === true;
    if (isConnected) {
      console.log('Client connected to Firebase Realtime Database');
      database.ref('connectionStatus').set(`Connect thành công vào lúc ${new Date().toLocaleString()}`);
    } else {
      console.log('Client disconnected from Firebase Realtime Database');
    }
});
app.use(express.static("public"));
app.get('/room/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    res.render("main", { roomId });
});


require('./app/routes/student.routes.js')(app);
require('./app/routes/teacher.routes.js')(app);
require('./app/routes/classes.routes.js')(app);
require('./app/routes/users.routes.js')(app);
server.listen(4000, () => {
    console.log("Server is listening on port 4000");
});
