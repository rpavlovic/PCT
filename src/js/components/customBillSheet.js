/**
* @module DropDown selects.
* @version
*/
var loadCustomBillSheet = (function ($) {
  'use strict';

  function initLoadCustomBillSheet() {

    function uploadCSV(ur_csv_file_path) {

      $.get(ur_csv_file_path, function(data) {
      console.log(data);
        // start the table
        var html = '<table>';

        // split into lines
        var rows = data.split("\n");
        var headers = rows[0].split(",");
        // parse lines
        html+="<thead><tr>";
        for(var i=0; i<headers.length; i ++) {
          html += "<th>" + headers[i].replace( /"/g, " " ) + "</th>";
        }
        html += "</tr></thead>";
        rows.forEach(function getvalues(ourrow, index) {
          if(index > 0) {
            // start a table row
            html += "<tr>";
            // split line into columns
            var columns = ourrow.split(",");
            for(var k=0; k<columns.length; k ++) {
              html += "<td>" + columns[k].replace( /"/g, " " ) + "</td>";
            }
            // close row
            html += "</tr>";
          }

        });
        // close table
        html += "</table>";
        $('#table').append(html);
      });
    }

    // insert into div
    $("#populateTable").on('click', function() {
      $("input[type=\"file\"]").trigger('click', function() {
      });
      $("input[type=\"file\"]").on('change', function() {
        console.log($(this).val());
        var file_name = $(this).val().match(/([^\\/]*)\/*$/)[1];
        uploadCSV('/data/' + file_name);
      });
    });
  }

  return {
    initLoadCustomBillSheet:initLoadCustomBillSheet
  }

})($);
