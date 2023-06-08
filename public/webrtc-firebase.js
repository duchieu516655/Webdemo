var peer = null;
var firestore = null;

function initConnection() {
	peer = new Peer(null, {
		debug: 2
	});
	peer.on('open', function(id) {
		console.log('Kết nối thành công với ID:', id);
	});
	peer.on('error', function(err) {
		console.log('Lỗi:', err);
	});
	firebase.initializeApp({
		apiKey: "AIzaSyCDiafKYiINX7uEvu5ISMmMQ-aC_nnwk_4",
  		authDomain: "webdemo-d1191.firebaseapp.com",
  		projectId: "webdemo-d1191",
  		storageBucket: "webdemo-d1191.appspot.com",
  		messagingSenderId: "362900762937",
  		appId: "1:362900762937:web:995904addcf44dcf26b8e8",
  		measurementId: "G-6X8EP3GBD7"
	});
	firestore = firebase.firestore();
}

function closeConnection() {
	if (peer) {
		peer.destroy();
	}
	if (firestore) {
		firestore.terminate();
	}
	console.log('Đã ngắt kết nối');
}
window.addEventListener('load', function() {
	initConnection();
});
window.addEventListener('unload', function() {
	closeConnection();
});