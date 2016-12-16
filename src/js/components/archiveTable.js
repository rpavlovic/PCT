
/**
* @module Draw Data Table for Archive records.
* @version
*/
var archiveTable = (function ($) {
  'use strict';

  function initArchiveTable() {

  var table = $('#archived-projects');

  var archivedTable = table.dataTable({
    "sDom": '<"toolbar"><B><tip>',
    "ajax": '/data/archived.json',
    "searching": true,
    // "dataSrc": 'd',
    "lengthMenu": [
      [ 10, 25, 50, -1 ],
      [ '10 rows', '25 rows', '50 rows', 'Show all' ]
    ],
    "columnDefs": [{
      "targets": -1,
      "data": null,
      "defaultContent": "<a title=\"remove row\" class=\"remove\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></a>"
    }],
    "columns": [
      { title: "Company" },
      { title: "Billing Office" },
      { title: "Ext. Start" },
      { title: "Duration" },
      { title: "Total Budget" },
      { title: "Win/Loss" },
      { title: "Status" },
      { title: "remove" },

      // { data: "d.results.Company" },
      // { data: "d.results.Compname" },
      // { data: "d.results.Office" },
      // { data: "d.results.City" },
      // { data: "d.results.District" },
      // { data: "d.results.Postalcode" },
      // { data: "d.results.District" },
      // { data: "d.results.Pobox" },
      // { data: "d.results.Street" },
      // { data: "d.results.Housenum" },
      // { data: "d.results.Street2" },
      // { data: "d.results.Building" },
      // { data: "d.results.Floor" },
      // { data: "d.results.Country" },
      // { data: "d.results.Region" },
      // { data: "d.results.Telnumber" },
      // { data: "d.results.Telextens" },
      // { data: "d.results.Faxnumber" },
      // { data: "d.results.Currency" },
    ],
    "bFilter": true,
    "select": true,
    "buttons": [
      'copy', 'csv', 'excel', 'pageLength',
      {
        "extend": 'pdf',
        "download": 'open'
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
    // "o Search": {"sSearch": "Archived Projects"},
    "fnInitComplete": function (nRow) {
      this.api().columns().every( function (index) {
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
    },
    "bDestroy": true,
  });
  // archivedTable.api().on( 'xhr', function () {
  //     var json = archivedTable.api().ajax.json();
  //     alert( json.data.length +' row(s) were loaded' );
  // } );
    $('.search-table').on( 'keyup change', function () {
       archivedTable.api().search( this.value ).draw();
    });
    $(".remove").on('click', function () {
      console.log($(this));
      archivedTable
      .row( $(this).parents('tr') )
      .remove()
      .draw(false);
    });
    $('#archived-projects tbody').on( 'click', '.remove', function () {
       archivedTable.api().row( $(this).parents('tr') ).remove().draw();
     } );
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
