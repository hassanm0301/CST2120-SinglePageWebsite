import express from "express";
import fetch from 'node-fetch';

const app = express();

app.use(express.static('public'));


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
})

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