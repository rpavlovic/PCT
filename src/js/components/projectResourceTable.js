
/**
* @module Draw Data Table for Archive records.
* @version
*/
var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {

    var table = $('#project-resource-table');

    var Cities,
        Practice,
        Deliverable,
        BillRate;
    var projResourceTable = table.DataTable({
      "searching": false,
      "sAjaxSource": get_data_feed( feeds['offices'] ),
      "sAjaxDataProp": "d.results",
      "bServerSide" : false,
      "paging": false,
      "stateSave": true,
      "info":     false,
      "bAutoWidth": false,
      "aaSortingFixed": [[2,'asc']],
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
        "targets": [1],
        "data": null,
        "defaultContent":'<a href=" " class="remove"><i class="fa fa-trash"></i></a>',
      },
      {
        "title": 'Deliverable / Work&nbsp;Stream',
        "data": '',
        "defaultContent": '',
        "render": function ( data, type, set, meta ) {
          var output = '<select class="deliverable">';
          output += data;
          output += '</select>';
          return output;
        }
      },
      {
        "title": 'Office',
        "data": "City",
        "defaultContent":'City',
        "render": function ( data, type, set, meta ) {
          if(data.indexOf('<select') === -1) {
            var output = '<select class="city">';
            output += '</select>';
            return output;
          } else {
           return data;
          }
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
        "defaultContent": 'Consumer',
        "render": function ( data, type, set, meta ) {
          var output = '<select class="practice">';
              output += '</select>';
          return output;
        }
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
        "defaultContent": 'Rate Card',
        "render": function ( data, type, set, meta ) {
          var output = '<select class="bill-rate">';
              output += '</select>';
          return output;
        }
      },
      {
        "title": 'Bill Rate <br/> Override',
        "data":" ",
        "defaultContent": '',
        "sClass": "rate-override"
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
      "rowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $(nRow).removeClass('odd even');
        $("td:nth-child(n+5):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", nRow).prop('contenteditable', true).addClass("contenteditable");
      },
       "drawCallback": function( settings, nRow, data) {
          var data = this.api();
      },
      "initComplete": function (nRow, data) {
        // console.log(data.d.results);
        Deliverable = ["Non-Deliverable Specific", "A","B"];
        $(Deliverable).each(function (key, value) {
          $('.deliverable').append($('<option>', { value : Deliverable[key] }).text(Deliverable[key]));
        });
        // TODO get data from Rate Card or DB.
        BillRate = ["Rate Card", "Office Standard Rate"];
        $(BillRate).each(function (key, value) {
          $('.bill-rate').append($('<option>', { value : BillRate[key] }).text(BillRate[key]));
        });
        // TODO get data from DB.
        Practice = ["Consumer", "HR Resources", "PR Counsel", "Finance"];
        $(Practice).each(function (key, value) {
          $('.practice').append($('<option>', { value : Practice[key] }).text(Practice[key]));
        });

        Cities = nRow.aoData.map(function(city) {
          return city._aData.City;
        });

        Cities = Cities.filter(function(value, key) {
          return Cities.indexOf(value) == key;
        });
        $(Cities).each(function (key, value) {
          $('.city').append($('<option>', { value : Cities[key] }).text(Cities[key]));
        });

        //to show a row with indexes.
        projResourceTable.on('order.dt', function () {
          projResourceTable.column(0, {"order" :"applied", "filter":"applied" }).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
          });
        }).draw();
      },
      "bDestroy": true,
    });
    //add row
    $('.project-resources #add-row').on( 'click', function (e) {
      e.preventDefault();
      var _del = "<select class=\"deliverable\">";
      Deliverable.map(function(key, value) {
        _del += '<option>'+Deliverable[value]+'</option>';
      });
      _del +='</select>';

      var _city = "<select class=\"deliverable\">";
      Cities.map(function(key, value) {
        _city += '<option>'+Cities[value]+'</option>';
      });
      _city +='</select>';

      projResourceTable.rows().nodes().to$().removeClass( 'new-row' );
      var rowNode = projResourceTable.row.add({
        'Deliverable': _del,
        'City': _city
      }).order( [[ 3, 'asc' ]] ).draw().node();
      $(rowNode).addClass('new-row');
    });
    //remove row
    $('#project-resource-table tbody').on( 'click', '.remove', function (e) {
      e.preventDefault();
      projResourceTable.row( $(this).parents('tr') ).remove().draw(false);
    });
  }
  return {
    initProjectResourceTable:initProjectResourceTable
  }

})($);