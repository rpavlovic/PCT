/**
* @module DropDown selects.
* @version
*/
var loadCustomBillSheet = (function ($) {
  'use strict';

  function initLoadCustomBillSheet() {

    function uploadCSV(ur_csv_file_path) {

      $.get(ur_csv_file_path, function(data) {

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
          //return JSON.stringify(result); //JSON
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
        var file_name = $(this).val().match(/([^\\/]*)\/*$/)[1];

        // $.ajax({
        //     url: "/data/"+file_name,
        //     async: false,
        //     success: function (csvd) {
        //       // console.log(csvd);
        //         // var items = $.csv.toArrays(csvd);
        //         var jsonobject = JSON.stringify(csvd);
        //         alert(jsonobject);
        //     },
        //     dataType: "text",
        //     complete: function () {
        //         // call a function on complete
        //     }
        // });








        uploadCSV('/data/' + file_name);
        // $('#table').dataTable({
        //   "ajax": '/data/'+ file_name,
        //   autofill: true
        // });
      });
    });



  }

  return {
    initLoadCustomBillSheet:initLoadCustomBillSheet
  }

})($);
