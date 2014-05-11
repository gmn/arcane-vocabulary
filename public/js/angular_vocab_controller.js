
function _alertFunc(msg) {
    alert( "message: '" + msg + "'" );
}

angular.module("vocabApp", [])
  .filter( 'searchFor', function() {
    return function(arr, searchString, count) {
        var result = [];
        if (!searchString) {
            if ( count ) 
                return result.length;
            return result;
        }
        var regex = new RegExp( '^' + searchString.toLowerCase() );

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){
            if ( item.word.match( regex ) ) {
                result.push(item);
            }
        });
        
        if ( count ) 
            return result.length;
        return result;
    } ;
  } )

  .filter( 'matchCount', function() {
    return function(arr, searchString) {
        if (!searchString) {
            return 0;
        }

        var how_many = 0;

        var regex = new RegExp( '^' + searchString.toLowerCase() );

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){
            if ( item.word.match( regex ) ) {
                ++how_many;
            }
        });
        
        return how_many;
    } ;
  } )

  .filter( 'arrayLength', function() {
      return function(ary) {
        if ( arguments.length === 0 )
            return 0;
        return ary.length;
      };
  } )

  .filter( 'reverse', function() {
    return function(word) {
        if (!word || word.length == 0) {
            return '';
        }
        var r = [];
        for ( var i = word.length-1 ; i >= 0; i-- ) {
            r.push( word[i] );
        }
        return r.join('').toUpperCase();
    } ;
  } )

  .filter( 'strlen', function() {
        return function(word) {
            if ( !word )
                return 0;
            return word.length;
        };
  } )

  .filter( 'isExactMatch', function() {
        return function(ary,word) {
            if (!word || word.length < 1) {
                return {bval:false,def:''};
            }
            var how_many = 0;
            word = word.toLowerCase();
            var regex = new RegExp( '^' + word + '$' );
            var def = '';
            angular.forEach(ary, function(item){
                if ( item.word.match( regex ) ) {
                    ++how_many;
                    def = item.def;
                }
            });
            return 1 == how_many ? {bval:true,def:def} : {bval:false,def:''};
        };
  } )

  .controller( 'searchBoxController', function($scope, $filter) 
  {
    $scope.items = [];
    $scope.keycount = -777;
    $scope.enterMessage = '';
    $scope.showtooltip = false;
    $scope.showConfirm = false;
    $scope.allowOverride = true;

    $scope.init = function() { 
        $scope.keycount = 0; 
        // create db from JSON from vocabulary.js
        $scope.db = queryable.open( {"db_name":"TestPage","data":JSON.stringify(_stub_vocabulary)} );
        $scope.items = $scope.db.find(/.*/);
        $scope.items = $scope.items._data;

        //$scope.items = _stub_vocabulary;
    }

    $scope.alertFunc = _alertFunc;

    $scope.key = function(e) {
        $scope.keycount++;
        if ( e.which === 13 ) { // RETURN/ENTER
            //$scope.alertFunc( $scope.searchString );

            e.stopPropagation();

            if ( $scope.showConfirm ) {
                $scope.insertOrUpdate();
                $scope.hideTooltip();
                $scope.hideConfirm();
            } else if ( ! $scope.showtooltip ) {
                $scope.showtooltip = true;
            } else {
                $scope.showConfirm = true;
            }
        }
        else if ( e.which === 27 ) { // ESCAPE
            if ( $scope.showConfirm ) {
                $scope.hideConfirm();
            } else {
                $scope.hideTooltip();
                $scope.hideConfirm();
            }
        }
    };

    $scope.hideTooltip = function() {
        $scope.showtooltip = false;
    };
    $scope.hideConfirm = function() {
        $scope.showConfirm = false;
    }

    $scope.insertOrUpdate = function() {
        var regex = new RegExp( '^'+$scope.searchString+'$' );
        var res = $scope.db.find( {word:regex} );
        if ( res.length == 1 ) { // UPDATE
            $scope.db.update( {word:regex}, {'$set':{def:$scope.definition}} );
        } else { // INSERT
            $scope.db.insert( {word:$scope.searchString,def:$scope.definition} );
        }
        
        $scope.items = $scope.db.find(/.*/);
        $scope.items = $scope.items._data;
    };

    $scope.dynamicDefinition = function() {
        var exactDef = $filter('isExactMatch')($scope.items,$scope.searchString);
        // if definition box has focus, don't force-set it, 
        // only change it if editing the 'word' parm

        if ( $scope.allowOverride ) 
            $scope.definition = exactDef.def;
        return exactDef.bval;
    };

    $scope.stopOverride = function() {
        $scope.allowOverride = false;
    };

    $scope.resumeOverride = function() {
        $scope.allowOverride = true;
    };


    //
    $scope.$on( 'toggle', function() {
        $scope.do_msg = !$scope.do_msg;
    } );

    $scope.send_event = function() {
    };

  } ); // .controller searchBoxController

