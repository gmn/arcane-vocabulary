var express = require('express');
var router = express.Router();
var fs = require('fs');

var exts = {
    ".html" : "text/html",
    ".htm": "text/html",
    ".js": "application/javascript",
    ".json": "application/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png",
    ".pdf": "application/pdf",
    ".flv": "video/x-flv",
    ".mp4": "video/mp4",
    ".gz": "application/x-gzip",
    ".gzip": "application/x-gzip",
    ".csv": "text/csv"
};


// any file in ./public
router.use( function(req, res) {
    if ( req.path.match(/queryable.js/) )
    {
        var sending = './node_modules/queryable/queryable.js';
        var mime = 'application/javascript';
    }
    else
    {
        var sending = './public/' + req.path;
        var s = req.path;  
        var mime = exts[ s.slice(s.lastIndexOf('.')) ] || "text/html";
    }
    console.log( 'sending file: "'+sending+'"' );
    fs.readFile( sending, function (err, blob) {
        res.writeHeader(200, {"Content-Type": mime});
        res.write(blob);
        res.end();
    });
});

/*
// special case
router.get('/queryable.js', function(req, res) {
    var sending = 'queryable.js';
    console.log( 'sending file: "'+sending+'"' );
    fs.readFile('./node_modules/queryable/queryable.js', function (err, html) {
        res.writeHeader(200, {"Content-Type": "application/javascript"});
        res.write(html);
        res.end();
    });
});


var index_page = 'index.html';
router.get('/', function(req, res) {
    fs.readFile('./public/'+index_page, function (err, html) {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    });
});
router.get('/vocabulary.js', function(req, res) {
    fs.readFile('./public/js/vocabulary.js', function (err, html) {
        res.writeHeader(200, {"Content-Type": "application/javascript"});
        res.write(html);
        res.end();
    });
});
router.get('/pager.js', function(req, res) {
    fs.readFile('./public/js/pager.js', function (err, html) {
        res.writeHeader(200, {"Content-Type": "application/javascript"});
        res.write(html);
        res.end();
    });
});
router.get( '/css/style.css', function(req, res) {
    fs.readFile('./public/css/style.css', function (err, html) {
        res.writeHeader(200, {"Content-Type": "text/css"});
        res.write(html);
        res.end();
    });
});
*/

module.exports = router;
