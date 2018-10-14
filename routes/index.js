var express = require('express');
var router = express.Router();
var path = require('path');
var AWS = require("aws-sdk");


AWS.config.update({
  region: "local",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/data', function(req,res){
var table = "Movies";


var year = 1940;

var title = "Fantasia";


var params = {
    TableName: table,
    Key:{
        "year": year,
        "title": title
    
}
};


docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        res.json(data);
    }
})

});
 
module.exports = router;
