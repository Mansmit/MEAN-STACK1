var express = require('express');
var router = express.Router();
var path = require('path');
var AWS = require("aws-sdk");

var bodyParser= require('body-parser');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing       

application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'views')));
AWS.config.update({
  region: "local",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/addmovie', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'movie_add.html'));
});

router.get('/deletemovie', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'movie_delete.html'));
});

router.get('/editquery', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'movie_search.html'));
});

/*To List movies*/
router.get('/data', function(req,res){
    var params = {
    TableName:"Movies",

ProjectionExpression:"#title,#year,#info",
ExpressionAttributeNames:{
"#title":"title",
"#year":"year",
"#info":"info"
}    

};

docClient.scan(params, onScan);
function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify

(err, null, 2));
    } else {
        return res.json(data)
       console.log("Scan succeeded.");
        data.Items.forEach(function(movie) {
           console.log(movie.title, movie.year, movie.info)
        });
if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
  }

});


/*To add movie*/
router.post('/create', function(req, res, next){
console.log(req.body);
var table ="Movies";
var year =parseInt(req.body.year);
var title =req.body.title;
var actors=req.body.actors;
var directors=req.body.directors;
var genres=req.body.genres;
var params = {
    TableName:table,
    Item:{
        "year":year,
        "title":title,
        "info":{
            "actors":actors,
            "directors":directors,
            "genres":genres
        }
    }
};

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, 

null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
    

});

 res.redirect('/');

});


/*To delete movie*/
router.delete('/delete', function(req, res, next){
console.log(req.body);
var table ="Movies";
var year =parseInt(req.body.year);
console.log(year);
var title =req.body.title;
console.log(title);
var params = {
    TableName:table,
    Key:{
        "year": year,
        "title": title
    },
    
};

console.log("Attempting a conditional delete...");
docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify

(err, null, 2));
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
});

 res.redirect('/');

});

/*To search the movie requested for edit*/
router.get('/datasearch', function(req,res){
var table = "Movies";
console.log(req.query);
var year = parseInt(req.query.year);
console.log(year);
var title = req.query.title;

var params = {
    TableName: table,
    Key:{
        "year": year,
        "title": title
    }
};

docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, 

null, 2));
    } else {
              res.json(data);
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }


});
  

});


/*To update movie*/
router.put('/update', function(req,res){
var table = "Movies";
console.log(req.body);
var year = parseInt(req.body.year);
console.log(year);
var title = req.body.title;

var params = {
    TableName:table,
    Key:{
        "year": year,
        "title": title
    },
    UpdateExpression: "set info.genres = :g, info.directors=:d, 

info.actors=:a",
    ExpressionAttributeValues:{
        
        ":g":req.body.genres,
        ":d":req.body.directors,
        ":a":req.body.actors
        
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Updating the item...");
docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify

(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
});

});

module.exports = router;
