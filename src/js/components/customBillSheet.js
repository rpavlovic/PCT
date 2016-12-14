/**
* @module DropDown selects.
* @version
*/
var loadCustomBillSheet = (function ($) {
  'use strict';

  function initLoadCustomBillSheet() {

    function uploadCSV(data) {

    var rows = data.split("\n");
      rows = rows.map(function(row) {
        var columns = row.split(/","/g);
        columns[0] =  columns[0].replace( /"/g, " " );
        columns[columns.length-1] = columns[columns.length-1].replace( /"/g, " " );
        return columns;
      });
    $("#table").dataTable({
        dom:'B',
        data: rows,
        select: 'single',
        searching: false,
        paging: true,
        length: false,
        altEditor: true,
        buttons: [{
        text: 'Add',
        name: 'add'        // do not change name
      },
      {
        extend: 'selected', // Bind to Selected row
        text: 'Edit',
        name: 'edit'        // do not change name
      },
      {
        extend: 'selected', // Bind to Selected row
        text: 'Delete',
        name: 'delete'      // do not change name
      }],
      columns: [
        { title: "Project Name" },
        { title: "Billing Office" },
        { title: "Ext. Start" },
        { title: "Duration" },
        { title: "Total Budget" },
        { title: "Win/Loss" },
        { title: "Status" }
      ],
      "bDestroy": true
    });
    }

    // insert into div
    $("#populateTable").on('click', function(opt_startByte, opt_stopByte, e) {

      $("input[type=\"file\"]").trigger('click', function() { });
      $("input[type=\"file\"]").on('change', function(evt) {
        var files = evt.target.files,
          file = files[0],
          file_name = file.name,
          start = parseInt(opt_startByte) || 0,
          stop = parseInt(opt_stopByte) || file.size - 1,
          reader = new FileReader();

        reader.onloadend = function(event) {
          if (event.target.readyState == FileReader.DONE) { // DONE == 2
            uploadCSV(event.target.result);
          }
        };
          var blob = file.slice(start, stop + 1);
            reader.readAsBinaryString(blob);
        });
      });

  }

  return {
    initLoadCustomBillSheet:initLoadCustomBillSheet
  }

})($);
