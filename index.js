import express from "express";
import fetch from 'node-fetch';
import mariadb from 'mariadb';

const app = express();
const pool = mariadb.createPool({
  host: "localhost:3306",
  user: "root",
  password: ""
});

app.use(express.static('public'));

// Error handling for mariadb
pool.getConnection()
    .then(conn => {
    
        conn.query("SELECT 1 as val").then((rows) => {
            console.log(rows); //[ {val: 1}, meta: ... ]
            //Table must have been created before 
            // " CREATE TABLE myTable (id int, val varchar(255)) "
            return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
        })
        .then((res) => {
            console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
            conn.end();
        })
        .catch(err => {
            //handle error
            console.log(err); 
            conn.end();
        })
        
    }).catch(err => {
        //not connected
    });

// opens port 8081
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
})

// redirects to page on connection
app.get('/', function (req, res) {
    res.sendFile(process.cwd()+'/page.html');
})

app.get('/getAppList', async function (req, res) {
    let response = await fetch("https://api.steampowered.com/ISteamApps/GetAppList/v2/");
    if (response.ok) {
        let json = await response.json();
        res.send(json);
      } else {
        res.send("HTTP-Error: " + response.status);
      }
})