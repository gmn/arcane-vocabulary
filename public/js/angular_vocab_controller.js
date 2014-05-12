
function _alertFunc(msg) {
    alert( "message: '" + msg + "'" );
}

var module_handle = angular.module("vocabApp", [])
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
    $scope.showPopover = false;
    $scope.showConfirm = false;
    $scope.allowOverride = true;
    $scope.definition = '';
    //$scope.inVal = false;

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
        if ( e.which === 13 ) { // RETURN / ENTER
            //$scope.alertFunc( $scope.searchString );

            e.stopPropagation();

//            $("#myModal").modal('show');
            if ( $scope.showConfirm ) {
                $scope.insertOrUpdate();
                $scope.hidePopover();
                $scope.hideConfirm();
            } else if ( ! $scope.showPopover ) {
                $scope.showPopover = true;
            } else {
                $scope.showConfirm = true;
            }
        }
        else if ( e.which === 27 ) { // ESCAPE

/*
            if ( $("#myModal").css("display") == "none" ) {
                $scope.searchString = '';
            } else {
                $("#myModal").modal('hide');
            }
*/

            // close just the confirmation box and leave the popover
            if ( $scope.showConfirm ) {
                $scope.hideConfirm();

            // hide the popover
            } else if ( $scope.showPopover ) {
                $scope.hidePopover();

            // no boxes are showing:- ESC clears string
            } else if ( $scope.searchString && $scope.searchString.length > 0 ) {
                $scope.searchString = '';
            }

        }
    };

    $scope.hidePopover = function() {
        $scope.showPopover = false;
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

    $scope.ModalSave = function(str) {
      if ( arguments.length === 1 && (!$scope.definition || $scope.definition.length==1) )
        $scope.definition = str;
      $scope.insertOrUpdate();
      console.log( "definition: " + $scope.definition );
      //$("#myModal").modal('hide');
      $scope.hidePopover();
    };
    $scope.ModalCancel = function() {
      //$("#myModal").modal('hide');
      console.log( "definition: " + $scope.definition );
      $scope.hidePopover();
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

    $scope.inputStyle = function() {
      if ( $scope.searchString && $scope.searchString.length > 0 ) 
        return {"color":"#919"};
      else
        return {};
    };


  } ); // .controller searchBoxController

/* loading example
$("#modal_submit").click(function() {
    var btn = $(this)
    btn.button('loading')
    $.ajax(...).always(function () {
      btn.button('reset')
    });
  });
*/
