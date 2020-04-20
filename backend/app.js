// Import ExpressJS for backend
var express = require('express');

// Here I will import the CryptoJS library
// to encrypt the data that will be transferred 
var crypto = require("crypto-js");

// Create app
var app = express();

// Import morgan package
const logger = require('morgan');

// Import CORS to send data to and from frontend
const cors = require('cors');


var socketApp = require('http').createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end()})
  , io = require('socket.io').listen(socketApp)
  , fs = require('fs')


// This is necessary for sending data to web pages
app.use(cors());
//app.use(cors({
//        origin : 'http://18.222.189.77:3000',
//        credentials : true
//        })
//);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));


// As part of the authorization process I will tolkenize some
// credentials using JSON Web Tokens, one thing needed for this is a header
// which consists of the type of token, which for our case will be
// JWT and the signing algorithm that will be used that could be RSA
var header = {
	"alg" : "HS256",
	"typ" : "JWT"
};

// Import MySQLlibrary to fetch data
// from database
const mysql = require('mysql');


// Authentication data for database
const connection = mysql.createConnection({
        // Database server credentials
        host : "localhost",
        user : "pixeldev",
        database : "pixel",
        password : "12345"
})



// Users array
var users = [];
var nextUserId = -1;
var query = "select * from user";


// Here we get information of all users in the
// database
        connection.query(query, function(err,result,fields)
        {
                // Checks for error
                if(err)throw(err);

                // Checks if the list variable result is empty
                // , if so then the user is not found
                if(result.length == 0)
                {
        				// console.log(req.body);
                        users =[];
                }
                else{
                        console.log(result);
                        users = result;
			nextUserId = users.length + 1;
		}

        });

var id = 0;



// Send user data to login form for authentication
app.get('/user_info', function(req,res) {
	return res.send(users);
});

//const { v4: uuidv4 } = require('uuid');

app.post('/signup', (req, res) => {
	console.log(req.body);
	let requestObj = {
		nextUserId, 
		username: req.body.username, 
		password: req.body.password, 
		email: req.body.email
	};
	console.log(requestObj);
	let signupQuery = `insert into user values ("${nextUserId++}", "${req.body.username}", "${req.body.username}", "${req.body.username}", "${req.body.email}", "${req.body.password}");`;

	connection.query(signupQuery, function(err, result) {
		if(err) {
			console.log(err.code);
			if (err.code === 'ER_DUP_ENTRY') {
				res.status(409).end();
				return;
			} else {
				res.status(500).end();
				return;
			}
		} 
		res.status(200).end();
		return;
	});
	return;
});



// Creates user and inserts user record to database
app.post('/create_user', function(req,res) {

	// Fetch user information
	// from request body
	var username = req.body.name;
	var surname = req.body.surname;
	var password = req.body.password;
	var idUser = users.length + 1;
	var email = req.body.email;
	

	// Store information in an object
	var userInfo = {
		"username" : username,
		"password" : password,
		"surname" : surname,
		"id" : idUser,
		"email" : email
	};

	// Encrypt user information
	var encryptedUserInfo = crypto.AES.encrypt(JSON.stringify(req.body), 'secret key 123').toString();

	// Decrypts user's information
	var decryptedUserInfo = crypto.AES.decrypt(JSON.stringify(encryptedUserInfo), 'secret key 123').toString()

	// This query will insert a new user as a new record to the table user
	var query = "insert into user values ('"+idUser+"','"+username+"','"+username+"','"+surname+"','"+email+"','"+password+"');";
	
	// Here the query will be run and we will check for a duplicate entry
	connection.query(query, function(err,result){
		if(err){
			if(err.code == 'ER_DUP_ENTRY')console.log("User already exists");
			else console.log("There was error");
		}
		else {
			 // Update user array after adding user
                        query = "select * from user";
                        connection.query(query, function(err,result,fields)
                        {
                                // Checks for error
                                if(err)throw(err);

                                // Checks if the list variable result is empty
                                // , if so then the user is not found
                                if(result.length == 0)
                                {
                        				// console.log(req.body);
                                        users =[];
                                }
                                else{
                                        console.log(result);
                                        users = result;
                                }
                        });
		}
	});
});

// Test
app.get('/', function (req, res) {
   res.send('Hello World');
})



app.post('/main',(req,resp)=>{
	// This secret variable will store the tokenized version of the object
	var secret = "";

	// This is the code that encrypts the user's information
	secret = crypto.Rabbit.encrypt(JSON.stringify(req.body), 'secret key 123').toString();

	console.log("Encrypted info :",secret);
	var payload = JSON.parse(crypto.enc.Utf8.stringify(crypto.Rabbit.decrypt(secret, 'secret key 123')));
	console.log("Decrypted info: ",payload);

	var username = payload.username;

	var sql = 'CALL getUserId("'+username+'")';
	
	var userInfo = {
		username : username,
		friends : []
	};
	connection.query(sql,true,(error,results,fields) => {
		if(error)
		{
			console.error(error.message);
		}

		// The previous stored procedure will only return 
		// the id of the user that has logged so it will return one
		// id, in the following code we will print to the console
		// all the friends of the user
		results[0].forEach((result) =>
			{
				// This console.log statement prints the id pertaining to the user with the
				// given username
				id = result.iduser;
				console.log(`User id for `+username+` is `+id);

				// Now we are getting the friends of this user using the 
				// user's id and calling the stored procedure
				// getFriends

				var sql2 = "CALL getFriends("+id+")";
//				console.log("The friends of "+username+" are");
				connection.query(sql2,true,(err,res,param)=>{
					
					if(err)console.error(err.message);
					
					res[0].forEach((i) =>
						{
							userInfo.friends.push(i.username);
					//		console.log(userInfo);
						});
					io.sockets.on('connection',function(socket){
						console.log(socket.connected);
						console.log(username+" has connected.");
					});
				
					return resp.send(userInfo);
				});

				//console.log(userInfo);
					
			});
	});
	console.log(userInfo);
});

var jwt = require('jsonwebtoken');
var supersecretkey = 'supersecretkey';
app.get('/jwttesting', (req, res) => {
	let token = jwt.sign({ foo: 'bar' }, supersecretkey);
	console.log(`token: ${token}`);
	res.json({ token: token }).status(200).end();
});

const verifyToken = (token) => {
	try {
		jwt.verify(token, supersecretkey);
	} catch(err) {
		return false;
	} 
	return true;
}

app.post('/signin', (req, res) => {
	// attempt to find user with username and password, if found, sign token and send in response
	console.log(req.body);
	let signinQuery = `select * from user where username = "${req.body.username}" and password = "${req.body.password}";`;
	connection.query(signinQuery, true, (error, results, fields) => {
		if (error) {
			console.log(error);
			res.status(500).end();
			return;
		}
		if (results.length === 0) {
			res.status(401).end();
			return;
		}
		let token = jwt.sign({}, supersecretkey, { expiresIn: '1h' });
		res.json({ token: token }).status(200).end();
	});
});

app.post('/verifyTokenTest', (req, res) => {
	console.log(verifyToken(req.body.token));
	res.status(200).end();
});


app.post('/get_friends', (req, res) => {
	console.log(req.body);
	//res.status(500).end();
	if (!verifyToken(req.body.token)) {
		res.status(409).end();
		return;
	}
	// make the query for friends here
	res.status(500).end();
});


// WEB SOCKET SECTION
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var lobbyNo = 1;
var lobbies = {};

io.on('connection', function(socket) {

	// join / create lobby 
	
	// increment lobby number (create new lobby) if needed
	if (io.nsps['/'].adapter.rooms["lobby-"+lobbyNo] && io.nsps['/'].adapter.rooms["lobby-"+lobbyNo].length > 1) lobbyNo++;
	// join lobby
	socket.join(`lobby-${lobbyNo}`);
	socket.lobbyNo = lobbyNo;
	io.in(`lobby-${lobbyNo}`).emit('connectHeard', lobbyNo);
	if (!lobbies.hasOwnProperty(`lobby-${lobbyNo}`)) {
		lobbies[`lobby-${lobbyNo}`] = {
			gameStarted: false, 
			playerCount: 1
		};
		socket.emit('hostConnectHeard');
	} else {
		io.in(`lobby-${lobbyNo}`).emit('gameStart');
		lobbies[`lobby-${lobbyNo}`].playerCount++;
		lobbies[`lobby-${lobbyNo}`].gameStarted = true;
	}
	console.log('a user connected to lobby ' + lobbyNo);

	// input listening
	socket.on('leftPress', function(fighterkey, lobby) {
		io.in(`lobby-${lobby}`).emit('leftHeard', fighterkey);
	});

	socket.on('rightPress', function(fighterkey, lobby) {
		io.in(`lobby-${lobby}`).emit('rightHeard', fighterkey);
	});

	socket.on('leftRightRelease', function(fighterkey, lobby) {
		io.in(`lobby-${lobby}`).emit('leftRightRelease', fighterkey);
	});

	socket.on('upPress', function(fighterkey, lobby) {
		io.in(`lobby-${lobby}`).emit('upHeard', fighterkey);
	});

	// triggered by player1 if player2 leaves and visa-verca
	socket.on('manualDisconnect', function() {
		socket.disconnect();
	});

	// host triggers syncronize every once in a while
	socket.on('hostUpdate', function(updateObj) {
		io.in(`lobby-${updateObj.lobbyNo}`).emit('syncFighters', updateObj);
	});

	socket.on('syncFighter', function(updateObj, lobbyNo) {
		socket.to(`lobby-${lobbyNo}`).emit('syncFighterHeard', updateObj, updateObj.fighterKey);
	});

	socket.on('latencyPing', function() {
		socket.emit('latencyPong');
	});


	// clean up lobbies on disconnection
	socket.on('disconnect', function() {
		console.log(`a user disconnected from lobby-${socket.lobbyNo}`);
		lobbies[`lobby-${socket.lobbyNo}`].playerCount--;
		if (lobbies[`lobby-${socket.lobbyNo}`].playerCount == 1) {
			io.in(`lobby-${lobbyNo}`).emit('playerDisconnect');
		} else if (lobbies[`lobby-${socket.lobbyNo}`].playerCount === 0) {
			delete lobbies[`lobby-${socket.lobbyNo}`];
		}
	});
});

http.listen(5000, function() {
	console.log('listening on 5000');
});

