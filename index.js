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

// redirects to page on connection
app.get('/', function (req, res) {
	res.sendFile(process.cwd()+'/page.html');
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
			currentSession.userID = res[0].User_ID;
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

// checks if user is logged in; returns bool
app.get("/checkLogin", (req, res) => {
	currentSession = req.session;
	if(currentSession.userID){
		res.send({loggedin: true})
	}
	else{
		res.send({loggedin: false})
	}
});

// searches for games and required data
app.post("/search", async (req, res) => {
	let sorting = req.body.sorting;
	let search = req.body.search;

	let connection = await pool.getConnection();

	let query = await connection.query("select * from games where name like '%" + search + "%'");
	delete query.meta;

	query.sort((a, b) =>{
		console.log(a[sorting])
		if(a[sorting]<b[sorting]){
			return -1;
		}
		if(a[sorting]>b[sorting]){
			return 1;
		}
		return 0;
	});

	res.send(query);

	return connection.end();
});

// queries reviews for particular game_ID
app.use("/displayReview", async(req, res)=>{
	let Game_ID = req.body.Game_ID;

	let connection = await pool.getConnection();

	let query = await connection.query("select reviews.User_ID, Reviews.Content, Reviews.Rating, users.Email, reviews.Game_ID \
		from reviews \
		inner join users on reviews.User_ID=users.User_ID\
		where Game_ID=?", [Game_ID]);
	delete query.meta;

	res.send(query);
	return connection.end();
});

// inserts review into DB and updates ratings
app.use("/postReview", async (req, res) => {
	let reviewContent = req.body.content;
	let Game_ID = req.body.Game_ID;
	let rating = req.body.rating;

	let connection = await pool.getConnection();

	let queryLastReview = await connection.query("select max(review_ID) from reviews");
	delete queryLastReview.meta;

	let insertReviewRes = await connection.query("insert into reviews values (?,?,?,?,?)", [
		queryLastReview[0]["max(review_ID)"] + 1,
		currentSession.userID,
		Game_ID,
		reviewContent,
		rating
	]);

	let updateGamesRes = await connection.query("update games set ave_rating=((ave_rating*rating_number)+?)/(rating_number+1), rating_number=rating_number+1 where Game_ID=?", [
		rating,
		Game_ID
	]);

	console.log(updateGamesRes);
	res.send({status: "ok"});
	return connection.end();
})