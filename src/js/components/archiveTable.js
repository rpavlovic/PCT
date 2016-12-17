
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
    // "ajax": '/data/OfficeCollection.json',
    "searching": true,
    // "sAjaxDataProp":"",
    "sAjaxSource": "/data/OfficeCollection.json",
    "sAjaxDataProp": "d.results",
    "bServerSide" : false,
    "lengthMenu": [
      [ 10, 25, 50, -1 ],
      [ '10 rows', '25 rows', '50 rows', 'Show all' ]
    ],
    "aoColumns": [
    {
      "sTitle": 'Company Name',
      "mData":"Compname"
    },
    {
      "sTitle": 'Billing Office',
      "mData":"Office"
    },
    {
      "sTitle": 'Office Name',
      "mData":"OfficeName"
    },
    {
      "sTitle": 'City',
      "mData":"City"
    },
    {
      "sTitle": 'District',
      "mData":"District"
    },
    {
      "sTitle": 'Postal Code',
      "mData":"Postalcode"
    },
    {
      "sTitle": 'Street',
      "mData":"Street"
    },
    {
      "sTitle": 'Street Number',
      "mData":"Housenum"
    },
    {
      "sTitle": 'Street 2',
      "mData":"Street2"
    },
    {
      "sTitle": 'Building',
      "mData": "Building"
    },
    {
      "mData":"null",
      "sClass":"center",
      "sDefaultContent":" <a class=\"remove\"><i class=\"fa fa-trash\"></i></a>",
    }
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
      // if (aData[5] === "Win") {
      //   $("td:eq(5)", nRow).addClass('win');
      // } else {
      //    $("td:eq(5)", nRow).addClass('loss');
      // }
    },
    //starts the table with search populted.
    // "o Search": {"sSearch": "Archived Projects"},
    "fnInitComplete": function (nRow) {
      this.api().columns().every(function (index) {
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
  archivedTable.api().on( 'xhr', function () {
    var json = archivedTable.api().ajax.json();
    console.log( json.d.results );
  });
  $('.search-table').on( 'keyup change', function () {
     archivedTable.api().search( this.value ).draw();
  });
  // $(".remove").on('click', function () {
  //   archivedTable.api()
  //   .row( $(this).parents('tr') )
  //   .remove()
  //   .draw(false);
  // });
  $('#archived-projects tbody').on( 'click', '.remove', function () {
     archivedTable.api().row( $(this).parents('tr') ).remove().draw();
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
