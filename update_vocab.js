// this upgrade the vocabulary.js to the newest vocabulary.json

var fs = require('fs');
var file = fs.readFileSync( process.env.HOME + '/Private/logs/databases/vocabulary.json', {encoding:'utf8', flag:'r'} );
var obj = JSON.parse( file );

var out = [];
obj.forEach(function(e){
    out.push( {"word":e.word,"def":e.def} );
});

var data = 'var _stub_vocabulary = ' + JSON.stringify( out ) + ';'

var filename = './public/js/vocabulary.js';
fs.writeFileSync( filename, data, {encoding:"utf8",mode:0666,flag:'w'} );

process.stderr.write( 'writing ' + out.length + ' words to ' + filename + "\n" );

