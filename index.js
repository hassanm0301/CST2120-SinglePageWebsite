import express from "express";
import fetch from 'node-fetch';
import mariadb from 'mariadb';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(cookieParser());

// connection details for MariaDB
const pool = mariadb.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "steamreview"
});


// allows executions of js functions in folder public
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// opens port 8081
var server = app.listen(42069, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("App listening at http://%s:%s", host, port);
});

// sends query to database and returns response
app.post("/login", async function(req, response){
	let conn;
	try {
		conn = await pool.getConnection();
		let res = await conn.query("select User_ID from users where Email=? and Password=?", [req.body.email, req.body.password]);
		delete res.meta;
		if(res.length != 0){
			console.log(res[0]);
			console.log("logged in success");
			response.send(res[0]);
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


