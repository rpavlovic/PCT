
/**
* @module Draw Data Table for Archive records.
* @version
*/
var archiveTable = (function ($) {
  'use strict';

  function initArchiveTable() {

  var table = $('#archived-projects');

  // function activeTable() {
  //   var table = $('#archived-projects');
  //   var activeTable = table({
  //     "dom": '<"toolbar"><B><tip>',
  //     "ajax": '/data/archived.json',
  //       searching: true,
  //       lengthMenu: [
  //        [ 10, 25, 50, -1 ],
  //        [ '10 rows', '25 rows', '50 rows', 'Show all' ]
  //       ],
  //       select: true,
  //       buttons: [
  //        'copy', 'csv', 'excel', 'pageLength',
  //       {
  //         extend: 'pdf',
  //         download: 'open'
  //       }
  //     ],
  //   });
  // }

  var archivedTable = table.dataTable({
    "dom": '<"toolbar"><B><tip>',
    "ajax": '/data/archived.json',
    // "bLengthChange": false,
    //removes search functionality.
    // "bFilter": false,
    searching: true,
    lengthMenu: [
      [ 10, 25, 50, -1 ],
      [ '10 rows', '25 rows', '50 rows', 'Show all' ]
    ],
    select: true,
    buttons: [
      'copy', 'csv', 'excel', 'pageLength',
      {
        extend: 'pdf',
        download: 'open'
      }
    ],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      //to find and style win/loss cells.
      if (aData[5] === "Win") {
        $("td:eq(5)", nRow).addClass('win');
      } else {
         $("td:eq(5)", nRow).addClass('loss');
      }
    },
    //starts the table with search populted.
    // "oSearch": {"sSearch": "Archived Projects"},
    initComplete: function () {
      this.api().columns().every( function () {
        var column = this;
        var select = $('<select selected><option value=""></option></select>')
         .appendTo( "div.toolbar")
          .on( 'change', function () {
            var val = $.fn.dataTable.util.escapeRegex(
              $(this).val()
            );
            column
              .search( val ? '^'+val+'$' : '', true, false )
              .draw();
          });
        column.data().unique().sort().each( function ( d, j ) {
          select.append( '<option value="'+d+'">'+d+'</option>' )
        });
      });
      $('.toolbar').hide();
    }
  });

  $('input[name="seach_proj_list"]').on( 'keyup', function () {
    archivedTable.search( this.value ).draw();
  });

  //TO SELECT STYLES.
  // table.on( 'click', 'tbody tr', function () {
  //     if ( table.row( this, { selected: true } ).any() ) {
  //         table.row( this ).deselect();
  //     }
  //     else {
  //         table.row( this ).select();
  //     }
  // } );
  // $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
  //pagination
  // var info = table.page.info();
  // var pages = $('#example_info').html();
  // // $('#example_info').each(function(){
  //    $('#tableInfo').html(
  //     'Currently showing page '+(info.page+1)+' of '+info.pages+' aa.'
  // );
  // })

  // $('#example_info').html(
  //     (info.page+1)+' of '+info.recordsTotal+' Archived Projects'
  // );
  }
  return {
    initArchiveTable:initArchiveTable
  }

})($);
