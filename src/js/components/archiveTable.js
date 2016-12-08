
/**
* @module Draw Data Table for Archive records.
* @version
*/
var archiveTable = (function ($) {
  'use strict';

  function initArchiveTable() {
    var table =   $('#example').DataTable({
         "dom": '<"toolbar"><ltip>',
        "bLengthChange": false,
        //removes search functionality.
        // "bFilter": false,
        searching: true,
        //starts the table with search populted.
        // "oSearch": {"sSearch": "Archived Projects"},
        initComplete: function () {
          this.api().columns().every( function () {
            var column = this;
            var select = $('<select selected><option value=""></option></select>')
          //    .appendTo('.search-projects .row.hide .field-wrapper')
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
        table.search( this.value ).draw();
      });
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
