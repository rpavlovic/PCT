/**
* @module DropDown selects.
* @version
*/
var loadCustomBillSheet = (function ($) {
  'use strict';

  function initLoadCustomBillSheet() {

    var csv_table = $("#csv-table"),
        new_table = $('#new-table');

    function uploadCSV(data) {
      var rows = data.split(/\n/),
          titles = '';
      //get titles from the Excel sheet
      for (var i = rows.length - 1; i >= 1; i--) {
        titles = rows[0].split(/","/g);

        if($.trim(titles[0]) === "Title") {
          titles[0] =  titles[0].replace(/"/g, "," );
          titles[titles.length-1] = titles[titles.length-1].replace( /"/g, "," );

          } else {
            titles = ['Title', 'Grade', 'Rate','Currency', 'Upload / Override', 'Discount'];
          }
        }

        rows = rows.map(function(row, index) {
          // var matched = row.match(/"[^"]+"/g).split();
          var columns = row.split(",");
          columns[0] =  columns[0].replace(/"/g, "");
          columns[columns.length-1] = columns[columns.length-1].replace(/"/g, " ");

          return columns;
        });

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
        bDestroy: true,
        // order: [[ 0, 'desc' ]],
        select: true,
        columns: [
          { title: titles[0] },
          { title: titles[1] },
          { title: titles[2] },
          { title: titles[3] },
          { title: titles[4] },
          { title: titles[5] },
        ],
         "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $("td:nth-child(n+3):not(:last-child)", nRow).prop('contenteditable', true).addClass("contenteditable");
             $(nRow).removeClass('odd even');
            $('#new-table_wrapper').addClass('hide');
            $('.custom-bill-sheet #add-row').addClass('hide');
            this.removeClass('hide');
         },
      });
    }

    $('.arrowpointer').on('click', function() {
      if (!$('#csv-table_wrapper').hasClass('hide')) {
        csv_table.tableToCSV();
      } else if($('#csv-table_wrapper').hasClass('hide')) {
        new_table.tableToCSV();
      }
    });

    // Upload CSV into a table.
    function uploadTable() {
      $("#uploadTable").on('click', function(opt_startByte, opt_stopByte, e) {

          $("input[type=\"file\"]").trigger('click', function() {});

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
              $('#bill-sheet-name').val(file_name.slice(0,-4));
          });
      });
    }
    uploadTable();

    $('td.contenteditable:eq(2)').on('keydown', function() {
          console.info($(this).text());
    });

    $('#downloadTemplate').on('click', function() {
     var download_template = new_table.DataTable({
        dom:'<tip>',
        "paging":   false,
        "ordering": false,
        "info":     false,
        stateSave: true,
        "order": [[ 1, 'asc' ]],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
           $("td", nRow).prop('contenteditable', true);
           this.removeClass('hide');
           $('.custom-bill-sheet #add-row').removeClass('hide');
           $(nRow).removeClass('odd even');
           $('#csv-table_wrapper').addClass('hide');
           $("td", nRow).prop('contenteditable', true).addClass("contenteditable");
        },
        "bDestroy": true,
      });

      //add row
      $('.custom-bill-sheet #add-row').on( 'click', function (e) {
        e.preventDefault();
        download_template.rows().nodes().to$().removeClass( 'new-row' );
        var rowNode = download_template.row.add( ['','','',''] ).draw().node();
        $(rowNode).addClass('new-row');
      });
    });

  }

  return {
    initLoadCustomBillSheet:initLoadCustomBillSheet
  }
})($);
