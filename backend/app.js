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

app.use(cors({
        origin : 'http://18.222.189.77:3000',
        credentials : true
        })
);

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
        //              console.log(req.body);
                        users =[];
                }

                else{
                        console.log(result);

                        users = result;

                }
        });








var id = 0;



// Send user data to login form for authentication

app.get('/user_info', function(req,res) {
	
return res.send(users);

})


























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

		else console.log("New user added successfully!");
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































var server = app.listen(5000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
