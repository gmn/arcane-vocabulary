
function _alertFunc(msg) {
    alert( "message: '" + msg + "'" );
}

var app = angular.module("vocabApp", [])
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
        return function(ary,word) 
        {
            var ret = { exact:false,def:'',count:0 };

            if (!word || word.length < 1) {
                return ret;
            }

            word = word.toLowerCase();
            var starting_reg = new RegExp( '^' + word );

            for ( var i = 0 ; i < ary.length; i++ ) {
                var item = ary[i];

                // if exact is true, we prevent unsetting it by a later word
                if ( !ret.exact && item.word !== word ) {
                    ret.def = '';
                    ret.exact = false;
                } else if ( item.word === word ) {
                    ret.def = item.def;
                    ret.exact = true;
                }

                // count the partial regex matches
                if ( item.word.match( starting_reg ) ) {
                    ret.count++;
                }
            }

            return ret;
        };
  } )

  .controller( 'searchBoxController', function($scope, $filter) 
  {
    $scope.items = [];
    $scope.keycount = -777;
    $scope.enterMessage = '';
    $scope.showPopover = false;
    $scope.showConfirm = false;
    $scope.allowOverwriting = true;
    $scope.word = {'definition':''};
    $scope.wordEvaluation = '';
    $scope.modalOpen = false;

    $scope.init = function() { 
        $scope.keycount = 0; 
        // create database of words from vocabulary.js
        $scope.db = queryable.open( {"db_name":"TestPage","data":_stub_vocabulary} );
        $scope.items = $scope.db.find(/.*/)._data;
    }

    $scope.alertFunc = _alertFunc;

    $scope.key = function(e) {
        $scope.keycount++;
        if ( e.which === 13 ) { // RETURN / ENTER

            e.stopPropagation();

            $("#myModal").modal('show');

            //$("#modalInput").focus(); 

            // doesn't work right away, wait a second
            //setTimeout( function(){ $("#modalInput").focus(); }, 500 );
            // ^ done in directive instead

            $scope.modalOpen = true;

/*
            if ( $scope.showConfirm ) {
                $scope.insertOrUpdate();
                $scope.hidePopover();
                $scope.hideConfirm();
            } else if ( ! $scope.showPopover ) {
                $scope.showPopover = true;
            } else {
                $scope.showConfirm = true;
            }
*/
        }
        else if ( e.which === 27 ) { // ESCAPE

            if ( $("#myModal").css("display") == "none" ) {
                $scope.searchString = '';
            } else {
                $("#myModal").modal('hide');
                $scope.modalOpen = false;
            }

/*
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
*/

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
        var word = $scope.searchString.trim().toLowerCase();
        var def = $scope.word.definition.trim();
        if ( res.length == 1 ) { // UPDATE
            $scope.db.update( {word:regex}, {'$set':{def:def}} );
        } else { // INSERT
            $scope.db.insert( {word:word,def:def} );
        }
        
        $scope.items = $scope.db.find(/.*/);
        $scope.items = $scope.items._data;
    };

    $scope.ModalSave = function() {
      $scope.insertOrUpdate();
      console.log( "word.definition: " + $scope.word.definition );
      $("#myModal").modal('hide');
      $scope.hidePopover();
      $scope.allowOverwriting = true;
      $scope.modalOpen = false;
    };
    $scope.ModalCancel = function() {
      $("#myModal").modal('hide');
      console.log( "word.definition: " + $scope.word.definition );
      $scope.hidePopover();
      $scope.allowOverwriting = true;
      $scope.modalOpen = false;
    };

    /* does 3 things:
        - returns boolean true if word matches exactly 1 stored word
        - sets the definition in the textarea
        - sets wordEvaluation
    */
    $scope.dynamicDefinition = function() {
        var edef = $filter('isExactMatch')($scope.items,$scope.searchString);

        // if definition box has focus, don't force-set it, 
        // only change it if editing the 'word' parm
        if ( $scope.allowOverwriting ) {
            //console.log( "overwriting" );
            $scope.word.definition = edef.def;
        } else {
            //console.log( "blocking overwrite" );
        }

        if ( edef.exact ) {
          $scope.wordEvaluation = 'Exact Match';
          return {color:'green'};
        } else if ( edef.count > 1 ) {
          $scope.wordEvaluation = 'Partial Match';
          return {color:'#F72'};
        } else {
          $scope.wordEvaluation = 'New Word';
          return {color:'red'};
        }
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

    $scope.matchingColor = function() {
      var num = $filter('matchCount')( $scope.items, $scope.searchString );
      return {color:{0:'red',1:'green',t:function(n){return(this[n])?this[n]:'#F72'}}.t(num)};
    }


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

//http://stackoverflow.com/questions/14833326/how-to-set-focus-in-angularjs
/*
app.directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
console.log('value='+value);
        if(value === true) { 
          $timeout(function() {
console.log("focus()");
            element[0].focus(); 
          });
        }
      });
      element.bind('blur', function() {
        scope.$apply(model.assign(scope, false));
console.log('blurring...');
      });
    }
  };
});
*/

app.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {

console.log( 'focusMe change! Value='+value );

        if (value === true) { 

          $timeout(function() {

            // prevent stealing focus from textarea
            if ( ! $("#modalDef").is(':focus') ) {
              element[0].focus();
//            scope[attrs.focusMe] = false;
            }

          }, 300 );
        }
      });
    }
  };
});
