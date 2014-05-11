var express = require('express');
var router = express.Router();
var fs = require('fs');

var index_page = 'index.html';

/* GET home page. */
router.get('/', function(req, res) {
    fs.readFile('./public/'+index_page, function (err, html) {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    });
});

router.get('/queryable.js', function(req, res) {
    fs.readFile('./node_modules/queryable/queryable.js', function (err, html) {
        res.writeHeader(200, {"Content-Type": "application/javascript"});
        res.write(html);
        res.end();
    });
});
router.get('/vocabulary.js', function(req, res) {
    fs.readFile('./public/javascripts/vocabulary.js', function (err, html) {
        res.writeHeader(200, {"Content-Type": "application/javascript"});
        res.write(html);
        res.end();
    });
});
router.get('/pager.js', function(req, res) {
    fs.readFile('./public/javascripts/pager.js', function (err, html) {
        res.writeHeader(200, {"Content-Type": "application/javascript"});
        res.write(html);
        res.end();
    });
});
router.get("/css/style.css", function(req, res) {
    fs.readFile('./public/css/style.css', function (err, html) {
        res.writeHeader(200, {"Content-Type": "text/css"});
        res.write(html);
        res.end();
    });
}); 

module.exports = router;
