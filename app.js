/******************************SET UP THE SERVER******************************/

//Import all packages (public) and modules (local)
var express = require("express");
var http = require("http");
var https = require("https")
var fs = require("fs");

//Port config, create Express application an create server
var httpPort = process.argv[2];
var httpsPort = process.argv[3];
var httpApp = express();
var httpsApp = express();
var httpServer = http.createServer(httpApp);
var httpsServer = https.createServer({
  key: fs.readFileSync("../../sergio/web/privkey.pem"),
  cert: fs.readFileSync("../../sergio/web/fullchain.pem")
},httpsApp);
httpServer.listen(httpPort);
httpsServer.listen(httpsPort);

//redirect http requests to https
httpApp.get("*",function(req, res, next) {
  res.redirect("https://" + req.hostname + ":" + httpsPort + req.url);
});

//read directories only once
const testFolder = 'public/models';
const modelList = fs.readdirSync(testFolder);

//add middleware components
//url logger
httpsApp.use(function (request, response, next) {
    console.log("%s\t%s\t%s\t%s\t", new Date(), request.ip.substr(7), request.method, request.url);
    //for Heroku use request.headers['x-forwarded-for'] for the ip
    next(); //control shifts to next middleware function (If we dont use this the user will be left hanging without a response)
});

//this one feeds all the files requested that are nested in /public folder (this saves us from having to create request handlers for images, html files, audios etc.)
httpsApp.use(express.static(__dirname + "/public"));

httpsApp.get('/modelList', function (req, res) {
  res.json(modelList);
});

httpsApp.get('*', function (req, res) {
    res.sendFile("/index.html", { root: "./public" });
});

console.log("%s\t%s\t",'Http app runing in port ' + httpPort,'Https app runing in port ' + httpsPort);