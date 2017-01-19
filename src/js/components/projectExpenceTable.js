
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
      "ajax" : {
         "url": get_data_feed( feeds['expenses'] ),
         "dataSrc": "d.results"
       },
      "paging": false,
      "stateSave": true,
      "info": false,
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
          "render": function ( data, type, set, meta ) {
            if(data.indexOf('<select') === -1) {
              var output = '<select class="deliverable">';
              output += '</select>';
              return output;
            } else {
             return data;
            }
          }
        },
        {
          "title": "Category",
          "data": "Category",
          "defaultContent": ''
        },
        {
          "title": "Description",
          "data": "Description",
          "defaultContent": ''
        },
        {
          "title": "Amount",
          "data": "Amount",
          "defaultContent": ''
        },
      ],
      "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $(nRow).removeClass('odd even');
        $("td:nth-child(n+4)", nRow).prop('contenteditable', true).addClass("contenteditable");
      },
      // TODO working on grouping the rows
      "fnInitComplete": function (nRow) {
        Deliverable = nRow.aoData["0"]._aData.Deliverable.map(function(_del) {
          return _del;
        });
        $(Deliverable).each(function (key, value) {
          $('.deliverable').append($('<option>', { value : value }).text(value));
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

    var _del = "<select class=\"deliverable\">";
    Deliverable.map(function(key, value) {
      _del += '<option>'+Deliverable[value]+'</option>';
    });
    _del +='</select>';
    projExpenceTable.rows().nodes().to$().removeClass( 'new-row' );
    var rowNode = projExpenceTable.row.add({
      'Deliverable': _del,
   }).order( [[ 2, 'asc' ]] ).draw(false).node();
   $("#project-expence-table tr:last").addClass('new-row');
  });
  //remove row
  $('#project-expence-table tbody').on( 'click', '.remove', function (e) {
    e.preventDefault();
    projExpenceTable.row( $(this).parents('tr') ).remove().draw(false);
  });
  }
  return {
    initExpenceTable:initExpenceTable
  }

})($);
