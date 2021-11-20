/******************************SET UP THE SERVER******************************/

//Import all packages (public) and modules (local)
var express = require("express");
var https = require("https")
var fs = require("fs");

//Port config, create Express application an create server
var port = process.argv[2];
var app = express();
var server = https.createServer({
  key: fs.readFileSync("../../sergio/router/privkey.pem"),
  cert: fs.readFileSync("../../sergio/router/fullchain.pem")
},app);
server.listen(port);

/****************************************************************************/

//read directories only once
const testFolder = 'public/models';
const modelList = fs.readdirSync(testFolder);

//add middleware components
//url logger
app.use(function (request, response, next) {
    console.log("%s\t%s\t%s\t%s\t", new Date(), request.ip.substr(7), request.method, request.url);
    //for Heroku use request.headers['x-forwarded-for'] for the ip
    next(); //control shifts to next middleware function (If we dont use this the user will be left hanging without a response)
});

//this one feeds all the files requested that are nested in /public folder (this saves us from having to create request handlers for images, html files, audios etc.)
app.use(express.static(__dirname + "/public"));

app.get('/modelList', function (req, res) {
  res.json(modelList);
});

app.get('*', function (req, res) {
    res.sendFile("/index.html", { root: "./public" });
});

console.log('Https app runing in port ',port);