
/**
* @module Draw Data Table for Archive records.
* @version
*/
var activeTable = (function ($) {
  'use strict';

  function initActiveTable() {

  var table = $('#active-projects');

  var activeTable = table.dataTable({
    "sDom": '<"toolbar"><B><tip>',
    // "ajax": '/data/OfficeCollection.json',
    "searching": true,
    // "sAjaxDataProp":"",
    "sAjaxSource": "/data/OfficeCollection.json",
    "sAjaxDataProp": "d.results",
    "bServerSide" : false,
    "iDisplayLength": 10,
    // "lengthMenu": [
    //   [10, 20, 30, -1 ],
    //   ['View 10 records', 'View 20 records', 'View 30 records', 'View All Projects' ]
    // ],
    "aoColumns": [
    {
      "sTitle": 'Project Name',
      "data":"Compname"
    },
    {
      "sTitle": 'Billing Office',
      "data":"Office"
    },
    {
      "title": 'Est.Date',
      "data":" ",
      "targets": [ -1 ],
      "defaultContent": ''
    },
    {
      "title": 'Duration',
      "data":" ",
      "targets": [ -1 ],
      "defaultContent": ''
    },
    {
      "title": 'Budget',
      "data":" ",
      "targets": [ -1 ],
      "defaultContent": ''
    },
    // {
    //   "sTitle": 'Office Name',
    //   "mData":"OfficeName"
    // },
    // {
    //   "sTitle": 'City',
    //   "mData":"City"
    // },
    // {
    //   "sTitle": 'District',
    //   "mData":"District"
    // },
    // {
    //   "sTitle": 'Postal Code',
    //   "mData":"Postalcode"
    // },
    // {
    //   "sTitle": 'Street',
    //   "mData":"Street"
    // },
    // {
    //   "sTitle": 'Street Number',
    //   "mData":"Housenum"
    // },
    // {
    //   "sTitle": 'Street 2',
    //   "mData":"Street2"
    // },
    // {
    //   "sTitle": 'Building',
    //   "mData": "Building"
    // },
    {
      "title" : 'Remove',
      "sClass": "center",
      "targets": [ -1 ],
      "data": '',
      "defaultContent":'<a href=" " class="remove"><i class="fa fa-trash"></i></a>',
    }
    ],
    "bFilter": true,
    "select": true,
    "buttons": [
      'copy', 'csv', 'excel',
      {
        "extend": 'pdf',
        "download": 'open'
      }
    ],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    },
    //when json is loaded add the filters to the toolbar div.
    "fnInitComplete": function (nRow) {
      this.api().columns().every(function (index, fn) {
        var column = this;
        var field_wrapper =$('<div class="field-wrapper"></div>');
        var label = $('<label for="search_'+index+'" class="show">Filter</label>');
        if(index < 5) {
          var select = $('<select name="search_'+index+'" selected><option value=""></option></select>')
          .appendTo( "div.toolbar")
            .on( 'change', function () {
              var val = $.fn.dataTable.util.escapeRegex(
                $(this).val()
              );
              column.search( val ? '^'+val+'$' : '', true, false ).draw();
            });
            select.wrap(field_wrapper);
            label.insertBefore(select);
            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
          });
        }
      });
      $('.toolbar').hide();
    },
  });
  activeTable.api().on( 'xhr', function () {
    var json = activeTable.api().ajax.json();
    console.log( json.d.results );
  });
  $('.search-table').on( 'keyup change', function () {
     activeTable.api().search( this.value ).draw();
  });
  // $( '.buttons-page-length' ).insertAfter('#active-projects_wrapperarchived-projects_wrapper').wrap("<div class=\"dt-buttons\" />").addClass('float-right');
  $('#active-projects tbody').on( 'click', '.remove', function (e) {
    e.preventDefault();
     activeTable.api().row( $(this).parents('tr') ).remove().draw();
   });
  }
  return {
    initActiveTable:initActiveTable
  }

})($);
