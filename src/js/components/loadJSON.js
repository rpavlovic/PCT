/**
* @module Load JSON
* @version
*/

var loadJSON = (function ($) {
  'use strict';

  var items = [];

  function Iterate_client_JSON(data) {

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
  }

  function Iterate_profile_JSON(data, frm) {
   var fields = $(frm + "  :input:not(button)"),
      fields_values = fields.serializeArray();

    $.each(data, function(key, val) {
      for (var key in val) {
        var ctrl = $("input[name='"+val[key]+"']", frm);
        ctrl.val(val.value);
        $('label[for="'+ctrl.attr('name')+'"]').text(val.value);
      }
    });
  }

  function initJSON(jsonFile) {

    $.getJSON(jsonFile, function(data, key) {
      if(jsonFile != '/data/profile.json') {
        Iterate_client_JSON(data);
      } else {
        Iterate_profile_JSON(data, '.form-edit-profile');
      }
    })
    .done(function() {
      if(jsonFile != '/data/profile.json') {
        $( "<ul/>", {
          "class": "data-list",
          html: items.join( "" )
        }).appendTo( "#json_data" );
      } else {
        //values and lables populate;
      }
    })
    .fail(function(jqXHR, exception) {
      console.log(jqXHR, exception);
    })
    .always(function() {
      console.log( "complete JSON" );
    });
  }
  return {
    initJSON:initJSON
  }

})($);