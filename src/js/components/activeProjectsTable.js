
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
    "bAutoWidth": false,
    "columnDefs": [ {
      "orderable": false,
      "targets": [5],
      }],
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
    {
      "title" : '<i class="fa fa-trash"></i>',
      "sClass": "center blue-bg",
      "targets": [ -1 ],
      "data": null,
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
      $(nRow).removeClass('odd even');
      $("td:not(:first-child):not(:last-child)", nRow).prop('contenteditable', true).addClass("contenteditable");
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
  // activeTable.api().on( 'xhr', function () {
  //   var json = activeTable.api().ajax.json();
  //   console.log( json.d.results );
  // });
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
