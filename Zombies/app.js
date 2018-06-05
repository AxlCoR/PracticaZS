var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');


var app = express();

app.set("views",path.resolve(__dirname, "views"));
app.set("view engine","ejs");

var publicPath = path.join(__dirname,'public');
app.use('/recursos',express.static(publicPath));

var entries = [];
app.locals.entries = entries;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false}));

var IP_MALVADA = "::1";

app.get('/',(request, response) => {
    response.render("menu");
});

app.get('/new-entry',(request, response) => response.render('new-entry'));

app.post('/new-entry',(request, response) => {
    if(!request.body.title || !request.body.body || !request.body.direc || !request.body.insta){
        response.status(400).send("Se tienen que completar todos los campos")
        return;
    }
    entries.push({
        title: request.body.title,
        body: request.body.body,
        direc: request.body.direc,
        insta: request.body.insta,
        created: new Date()  
    });
    response.redirect('/');
});

app.get('/victimas',(request, response) => {

    if(request.ip === IP_MALVADA){
        response.status(401).send("Intento de acceso no autorizado");
    }else{
        response.render('victimas');
    }
});
app.get('/armas',(request, response) => response.render('armas'));
app.get('/clases',(request, response) => response.render('clases'));
app.use((request,response)=>{
    response.writeHead(404,{"Content-type":"text/html"});
    response.end("<h2>404 Not Found</h2>");  
});

app.use((request, response) => response.status(404).render('404'));
http.createServer(app).listen(3000);