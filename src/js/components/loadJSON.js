/**
* @module Load JSON
* @version
*/

var loadJSON = (function ($) {
  'use strict';

  function initJSON(jsonFile) {

    var items = [];

    $.getJSON(jsonFile, function(data) {
      $.each(data.d.results, function(key, val) {
        for (var key in val) {
          if(typeof val[key] === 'object') {
            for(var key_2 in val[key] ) {
              items.push( "<li class='" + key_2 + "'>" + '<span><strong>' + key_2 + ': </strong></span>' + val[key][key_2] + "</li>" );
            }
          } else {
            items.push( "<li class='" + key + "'>" + '<span><strong>' + key + ': </strong></span>' + val[key] + "</li>" );
          }
        }
      });
    })
    .done(function() {
      $( "<ul/>", {
         "class": "data-list",
         html: items.join( "" )
       }).appendTo( "#json_data" );
    })
    .fail(function() {
      console.log( "error!!" );
    })
    .always(function() {
      console.log( "complete" );
    });
  }
  return {
    initJSON:initJSON
  }

})($);
