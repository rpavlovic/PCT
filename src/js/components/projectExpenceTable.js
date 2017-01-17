
/**
* @module Draw Data Table for Archive records.
* @version
*/
var expenceTable = (function ($) {
  'use strict';

  function initExpenceTable() {


  var Deliverable;

  var table = $('#project-expence-table');

  var projExpenceTable = table.DataTable({
    // "dom":'<tip>',
    "searching": false,
    "sAjaxSource": "/data/expences.json",
    "sAjaxDataProp": "d.results",
    "paging": false,
    "stateSave": true,
    "info":     false,
    "length": false,
    "bFilter": false,
    "select": true,
    "columnDefs": [ {
      "orderable": false,
      "targets": [ 0, 1 ],
    } ],
    "columns": [{
        "title": 'Row',
        "sClass": "center",
        "defaultContent": '',
        "data": null,
      },
      {
        "title" : '<i class="fa fa-trash"></i>',
        "sClass": "center blue-bg",
        "targets": [1],
        "data": null,
        "defaultContent":'<a href=" " class="remove"><i class="fa fa-trash"></i></a>',
      },
      {
        "title": 'Deliverable / Work&nbsp;Stream',
        "data": "Deliverable",
        "defaultContent": '',
        "render": function ( data, type, set, meta ) {
          var output = '<select class="deliverable">';
              output += '</select>';
          return output;
        }
      },
      {
        "title": "Category",
        "data": "Category",
        "defaultContent": "Out of Pocker (OOP)"
      },
      {
        "title": "Description",
        "data": "Description",
        "defaultContent": ''
      },
      {
        "title": "Amount",
        "data": "Amount",
        "defaultContent": "$1000"
      },
    ],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      $(nRow).removeClass('odd even');
      $("td:nth-child(n+4)", nRow).prop('contenteditable', true).addClass("contenteditable");
    },
    "fnInitComplete": function (nRow) {

      Deliverable = nRow.aoData.map(function(deliverable) {
        return deliverable._aData.Deliverable;
      });

      Deliverable = Deliverable.filter(function(value, key) {
        return Deliverable.indexOf(value) == key;
      });

      $(Deliverable).each(function (key, value) {
        $('.deliverable').append($('<option>', { value : Deliverable[key] }).text(Deliverable[key]));
      });

      projExpenceTable.on('order.dt', function () {
        projExpenceTable.column(0, {"order" :"applied", "filter":"applied" }).nodes().each( function (cell, i) {
          cell.innerHTML = i+1;
        });
      }).draw();
    },
     "bDestroy": true,
  });
  //add row
  $('.project-expence').on( 'click', '#add-row', function (e) {
    e.preventDefault();
    projExpenceTable.rows().nodes().to$().removeClass( 'new-row' );

    // var options = $(Deliverable).each(function (key, value) {
    //   $('.deliverable').append($('<option>', { value : Deliverable[key] }).text(Deliverable[key]));
    // });
    var test = projExpenceTable.columns().nodes();
    console.log(test);
    var rowNode = projExpenceTable.row.add([projExpenceTable.column(2)]).draw().node();
    $(rowNode).addClass('new-row');
  });

  //remove row
  $('#project-expence-table tbody').on( 'click', '.remove', function (e) {
    e.preventDefault();
   projExpenceTable.row( $(this).parents('tr') ).remove().draw(false);
  });
  //clear all edited fields
  $('button[type="reset"]').on('click', function() {
    confirm("All overrides will be removed?");
    $("#project-expence-table tr").each(function (key, value) {
      $(this).find('td.contenteditable').empty()
    })
  });
  }
  return {
    initExpenceTable:initExpenceTable
  }

})($);
