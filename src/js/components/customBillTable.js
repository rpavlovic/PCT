/**
* @module Uploads CSV comma delimetered document into a Client Rate Card.
* @version
*/
var loadCustomBillSheet = (function ($) {
  'use strict';

  function initLoadCustomBillSheet() {

    var csv_table = $("#csv-table");

    function uploadCSV(data) {
      var newlines = /\r|\n/.exec(data);

      if(newlines) {
        var rows = data.split(/\n/),
            titles = '';
        //get titles from the Excel sheet
        for (var i = rows.length - 1; i >= 1; i--) {
          if(rows[0].indexOf(',') != -1) {
            titles = rows[0].split(/","/g);

            if($.trim(titles[0]) === "Title") {
              //get titles from the Excel.
              titles[0] = titles[0].replace(/"/g, "," );
              titles[titles.length-1] = titles[titles.length-1].replace( /"/g, "," );
            } else {
              //if not preset to defaults.
              titles = ['Title', 'Grade', 'Rate','Currency', 'Upload / Override', 'Discount'];
            }
          }
        }
        rows = rows.map(function(row, index) {
          var columns = row.split(",");
          columns[0] =  columns[0].replace(/"/g, "");
          columns[columns.length-1] = columns[columns.length-1].replace(/"/g, " ");
          return columns;
        });

        //remove the row with titles from the table
        if($.trim(rows["0"]["0"]) === 'Title') {
          rows.shift();
        }

        csv_table.dataTable({
          dom:'<tip>',
          data: rows,
          select: {
            items: 'cells',
            info: false
          },
          searching: false,
          paging: false,
          length: false,
          order: [[ 1, 'asc' ]],
          columns: [
            { title: titles[0] },
            { title: titles[1] },
            { title: titles[2] },
            { title: titles[3] },
            { title: titles[4],
              render : function(data, type, row) {
                return "<div contenteditable />" ;
              }
            },
            { title: titles[5] }
          ],
           "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
              $(nRow).removeClass('odd even');
              $("td:nth-child(n+5):not(:last-child)", nRow)
              .addClass("contenteditable");
              $("td:nth-child(3)", nRow).addClass('rate num');
              $("td:nth-child(6)", nRow).addClass('discount num');
              $("td:nth-child(5)", nRow).addClass('rate-override num');
           },
          bDestroy: true,
        });
      }
    }

    // Upload CSV into a table.
    function uploadTable() {
      $("#uploadTable").on('click', function(event, opt_startByte, opt_stopByte) {
        console.log(this);
        $("input[type=\"file\"]").trigger('click', function() {
          event.stopPropagation();
        });

        $("input[type=\"file\"]").on('change', function(evt) {

          var files = evt.target.files,
              file = files[0],
              file_name = file.name,
              start = parseInt(opt_startByte) || 0,
              stop = parseInt(opt_stopByte) || file.size - 1,
              reader = new FileReader();

          reader.onloadend = function(event) {
            if (event.target.readyState == FileReader.DONE) {
              uploadCSV(event.target.result);
            }
          };
          var blob = file.slice(start, stop + 1);

          reader.readAsBinaryString(blob);
          $('#bill-sheet-name').val(file_name.slice(0,-4));
        });
        event.stopPropagation();
      });
    }
    //save the csv on the desktop
    //TODO: save to server and Profile page
    $('.arrowpointer').on('click', function() {
      csv_table.tableToCSV();
    });
    //TODO delete from Server and Profile page.
    $('#DeleteCustomBillSheet').on('click', function() {
      confirm("The template will be deleted and Overrides removed?");
      $("#csv-table tr").each(function (key, value) {
        $(this).find('td.rate-override').empty();
        $(this).find('td.discount').empty();
      });
    });
    uploadTable();
  }

  return {
    initLoadCustomBillSheet:initLoadCustomBillSheet
  };
})($);
