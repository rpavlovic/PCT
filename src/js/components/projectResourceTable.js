
/**
* @module Draw Data Table for Archive records.
* @version
*/
var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {

  var table = $('#project-resource-table'),
      cities = [];


  var projResourceTable = table.DataTable({
        "searching": false,
        "sAjaxSource": "/data/OfficeCollection.json",
        "sAjaxDataProp": "d.results",
        "bServerSide" : false,
        "paging": false,
        "stateSave": true,
        "info":     false,
        "bAutoWidth": false,
        "columnDefs": [ {
          "orderable": false,
          "targets": [ 0, 1 ],
          } ],
        "order": [[ 3, 'asc' ]],
        "columns": [{
          "title": 'Row',
          "sClass": "center",
          "defaultContent": '',
          "data": null,
        },
        {
          "title" : '<i class="fa fa-trash"></i>',
          "sClass": "center blue-bg",
          "targets": [ 1 ],
          "data": null,
          "defaultContent":'<a href=" " class="remove"><i class="fa fa-trash"></i></a>',
        },
        {
          "title": 'Deliverable / Work&nbsp;Stream',
          "defaultContent":'',
          "targets": [ 2 ],
        },
        {
          "title": 'Office',
          "data": "City",
          "defaultContent":'City',
          "render": function ( data, type, set, meta ) {
            var output = '<select class="city">';
                output += '</select>';
            return output;
          }
        },
        {
          "title": 'Title',
          "data":"title",
          "defaultContent": ''
        },
        {
          "title": 'Class',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'Practice',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'Role',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'Proposed <br/> Resource',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'Bill Rate',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'Bill Rate <br/> Override',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'Total Hours',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'Total Fees',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'JAN <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'FEB <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'MAR <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'APR <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'MAY <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'JUN <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'JUL <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'AUG <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'SEP <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'OCT <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'NOV <br/> 16',
          "data":" ",
          "defaultContent": ''
        },
        {
          "title": 'DEC <br/> 16',
          "data":" ",
          "defaultContent": ''
        }],
        "bFilter": false,
        "select": true,
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          $(nRow).removeClass('odd even');
          $("td:nth-child(n+3):not(:nth-child(4)):not(:nth-child(6)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", nRow).prop('contenteditable', true).addClass("contenteditable");
        },
        "fnInitComplete": function (nRow) {
          //to show a row with indexes.
          projResourceTable.on('order.dt', function () {

            var Cities = nRow.aoData.map(function(city) {
              return city._aData.City;
            });
            Cities = Cities.filter(function(value, key) {
              return Cities.indexOf(value) == key;
            });

            $(Cities).each(function (key, value) {
              $('.city').append($('<option>', { value : Cities[key] }).text(Cities[key]));
            });
            projResourceTable.column(0, {"order" :"applied", "filter":"applied" }).nodes().each( function (cell, i) {
              cell.innerHTML = i+1;
            });
          }).draw();
        },
      });
  //add row
  $('#add-row').on( 'click', function (e) {
    e.preventDefault();
    projResourceTable.rows().nodes().to$().removeClass( 'new-row' );
    var rowNode = projResourceTable.row.add(projResourceTable.context["0"].aoData["0"]._aData).draw(false).node();
    $(rowNode).addClass('new-row');
  });
  //remove row
  $('#project-resource-table tbody').on( 'click', '.remove', function (e) {
    e.preventDefault();
     projResourceTable.row( $(this).parents('tr') ).remove().draw();
   });
  }
  return {
    initProjectResourceTable:initProjectResourceTable
  }

})($);
