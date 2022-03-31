import express from "express";
import mariadb from 'mariadb';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();
const oneDay = 1000 * 60 * 60 * 24;

app.use(cookieParser());
app.use(session({
    secret: "super8464secret4567key356",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

// connection details for MariaDB
const pool = mariadb.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "steamreview"
});


// allows executions of js functions in folder public
app.use(express.static('public'));

// bodyparser to allow all types of data transfer between client and server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// global session variable to store current session
var currentSession;

// opens port 8081
var server = app.listen(42069, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("App listening at http://%s:%s", host, port);
});

// sends query to database and returns response
app.post("/login", async function(req, response){
	let conn;
	let email = req.body.email;
	let password = req.body.password;
	try {
		conn = await pool.getConnection();
		let res = await conn.query("select User_ID from users where Email=? and Password=?", [email, password]);
		delete res.meta;
		if(res.length != 0){
			currentSession = req.session;
			currentSession.email = email;
			console.log(req.session);
			console.log("logged in success");
			response.send({email});
		}
		else{
			console.log("error");
			response.send({error:"error"});
		}
	} 
	catch (err) {
		console.log(err);
	  	return err;
	}
	finally {
	  	if (conn){
			return conn.end();
	  	}
	}
})

// redirects to page on connection
app.get('/', function (req, res) {
	res.sendFile(process.cwd()+'/page.html');
});

app.get("/checkLogin", (req, res) => {
	console.log("check called")
	currentSession = req.session;
	if(currentSession.email){
		res.send({loggedin: true})
	}
	else{
		res.send({loggedin: false})
	}
});
