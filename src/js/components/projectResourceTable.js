
/**
* @module Draw Data Table for Archive records.
* @version
*/
var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {

  var table = $('#project-resource-table'),

      projResourceTable = table.DataTable({
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
          "targets": [ 1 ],
          }
        ],
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
          "defaultContent":' ',
          "render": function ( data, type, set, meta ) {
            var output = '<select>';
            // for(var i = 0; i < meta.row.length; i++;) {
              output += '<option>'+ data + '</option>';
            // }
            output += '</select>';
            return output;
          }
        },
        {
          "title": 'Title',
          "data":"title",
          "targets": [ 3 ],
          "defaultContent": ''
        },
        {
          "title": 'Class',
          "data":" ",
          "targets": [ 4 ],
          "defaultContent": ''
        },
        {
          "title": 'Practice',
          "data":" ",
          "targets": [ 5 ],
          "defaultContent": ''
        },
        {
          "title": 'Role',
          "data":" ",
          "targets": [ 6 ],
          "defaultContent": ''
        },
        {
          "title": 'Proposed <br/> Resource',
          "data":" ",
          "targets": [ 7 ],
          "defaultContent": ''
        },
        {
          "title": 'Bill Rate',
          "data":" ",
          "targets": [ 8 ],
          "defaultContent": ''
        },
        {
          "title": 'Bill Rate <br/> Override',
          "data":" ",
          "targets": [ 9 ],
          "defaultContent": ''
        },
        {
          "title": 'Total Hours',
          "data":" ",
          "targets": [ 10 ],
          "defaultContent": ''
        },
        {
          "title": 'Total Fees',
          "data":" ",
          "targets": [ 11 ],
          "defaultContent": ''
        },
        {
          "title": 'JAN <br/> 16',
          "data":" ",
          "targets": [ 12 ],
          "defaultContent": ''
        },
        {
          "title": 'FEB <br/> 16',
          "data":" ",
          "targets": [ 13 ],
          "defaultContent": ''
        },
        {
          "title": 'MAR <br/> 16',
          "data":" ",
          "targets": [ 14 ],
          "defaultContent": ''
        },
        {
          "title": 'APR <br/> 16',
          "data":" ",
          "targets": [ 15 ],
          "defaultContent": ''
        },
        {
          "title": 'MAY <br/> 16',
          "data":" ",
          "targets": [ 16 ],
          "defaultContent": ''
        },
        {
          "title": 'JUN <br/> 16',
          "data":" ",
          "targets": [ 17 ],
          "defaultContent": ''
        },
        {
          "title": 'JUL <br/> 16',
          "data":" ",
          "targets": [ 18 ],
          "defaultContent": ''
        },
        {
          "title": 'AUG <br/> 16',
          "data":" ",
          "targets": [ 19 ],
          "defaultContent": ''
        },
        {
          "title": 'SEP <br/> 16',
          "data":" ",
          "targets": [ 20 ],
          "defaultContent": ''
        },
        {
          "title": 'OCT <br/> 16',
          "data":" ",
          "targets": [ 21 ],
          "defaultContent": ''
        },
        {
          "title": 'NOV <br/> 16',
          "data":" ",
          "targets": [ 22 ],
          "defaultContent": ''
        },
        {
          "title": 'DEC <br/> 16',
          "data":" ",
          "targets": [ 23 ],
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
            projResourceTable.column(0, {"order" :"applied", "filter":"applied" }).nodes().each( function (cell, i) {
              cell.innerHTML = i+1;
            });
          }).draw();
        },
        // "drawCallback": function ( settings ) {
        //            var api = this.api();
        //            var rows = api.rows( {page:'current'} ).nodes();
        //            var last=null;

        //            api.column(0, {page:'current'} ).data().each( function ( group, i ) {
        //                    if ( last !== group ) {
        //                            $(rows).eq( i ).before(
        //                                    '<select><option>'+group.City+'</option></select>'
        //                            );

        //                            last = group.City;
        //                    }
        //            } );
        //    },
      });

  //add row
  $('#addRow').on( 'click', function (e) {
    e.preventDefault();
    projResourceTable.row.add([]).draw( false );
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
