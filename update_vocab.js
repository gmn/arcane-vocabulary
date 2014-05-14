// this upgrade the vocabulary.js to the newest vocabulary.json
/* 
 * note: once meta-data is included in the web-based vocab db, this over-write will
 *       will break the db
 */

var fs = require('fs');
function getstring(path) {
    return fs.readFileSync( path, {encoding:'utf8', flag:'r'} );
}

var newest = process.env.HOME + '/Private/logs/databases/vocabulary.json';
var filename = './public/js/vocabulary.js';
var prefix = 'var _stub_vocabulary = '; 
var postfix = new RegExp(';$');

var newfile = getstring(newest);
var obj = JSON.parse( newfile );

var origfile = getstring(filename);
var origobj = JSON.parse( origfile.replace(prefix,'').replace(postfix,'') );

if ( origobj.length === obj.length ) {
    console.log( "not overwriting. no change" );
    process.exit(0);
}

// sanitize - we only need word and def
var out = [];
obj.forEach(function(e){
    out.push( {"word":e.word,"def":e.def} );
});

var data = 'var _stub_vocabulary = ' + JSON.stringify( out ) + ';' ;

fs.writeFileSync( filename, data, {encoding:"utf8",mode:0666,flag:'w'} );

process.stderr.write( 'writing ' + out.length + ' words to ' + filename + "\n" );
process.stderr.write( "original count before overwrite: " + origobj.length + "\n" );

