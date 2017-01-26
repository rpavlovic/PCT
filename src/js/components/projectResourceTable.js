/**
* @module Draw Data Table for Preoject Resource page.
* @version
*/
var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {

    var table = $('#project-resource-table');

    var Cities,
        Practice,
        Deliverable = [],
        EmpTitle = [],
        BillRate = [];

    var projResourceTable = table.DataTable({
      "searching": false,
      "ajax" : {
         "url": get_data_feed( feeds['offices'] ),
         "dataSrc": "d.results"
       },
      "bServerSide" : false,
      "paging": false,
      "stateSave": true,
      "info":     false,
      "bAutoWidth": false,
      // "aaSortingFixed": [[2,'asc']],
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
        "data": null,
        "render": function () {
          return "<select class='deliverable' />";
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
        "data": null,
        "render": function () {
          return "<select class='title' />";
        }
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
        "defaultContent": '',
        "data": null
      },
      {
        "title": 'Bill Rate <br/> Override',
        "data": function ( row, type, val, meta ) {
          if (type === 'set') {
            row.price = val;
            // Store the computed display and filter values for efficiency
            row.price_display = val=="" ? "" : "$"+numberFormat(val);
            row.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
            return;
          }
          else if (type === 'display') {
            return row.price_display;
          }
          else if (type === 'filter') {
            return row.price_filter;
          }
          // 'sort', 'type' and undefined all just use the integer
          return row.price;
        },
        "defaultContent": '',
        "sClass": "rate-override num"
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
        $("td:nth-child(n+6):not(:nth-child(7)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", nRow).prop('contenteditable', true).addClass("contenteditable");
      },
      "drawCallback": function( settings ) {
        // console.log( 'DataTables has redrawn the table' );
      },
      "initComplete": function (nRow) {

        //get deliverables from json and call function here.
        getDeliverables();

        //get card bill data from json and call function here.
        getCardBill();

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

    //get deliverables from projectRelatedDeliverables json
    function getDeliverables() {
      $.getJSON(get_data_feed(feeds.projectDeliverables),  function(deliverables) {
        deliverables.d.results.map(function(val, key) {
          if (val.DelvDesc) {
            Deliverable.push($('<option>', { value :key }).text(val.DelvDesc));
          }
        });
        $('.deliverable').empty().append(Deliverable);
      });
    }

    //get deliverables from projectRelatedDeliverables json
    function getCardBill() {
      $.getJSON(get_data_feed(feeds.rateCards), function(rates) {
        rates.d.results.map(function(val, key) {
          BillRate.push(val.BillRate);
          EmpTitle.push($('<option>', { value :key }).text(val.EmpGradeName));
        });
        $('.title').empty().append(EmpTitle);
      });
    }
    //add row
    function addRow() {
      $('.project-resources #add-row').on( 'click', function (e) {
        e.preventDefault();

        var _city = "<select class=\"city\">";
        Cities.map(function(key, value) {
          _city += '<option>'+Cities[value]+'</option>';
        });
        _city +='</select>';

        projResourceTable.rows().nodes().to$().removeClass( 'new-row' );

        var rowNode = projResourceTable.row.add({
          'City': _city
        }).order( [[ 3, 'asc' ]] ).draw().node();

        $(rowNode).addClass('new-row');
        $('.deliverable').empty().append(Deliverable);
        $('.title').empty().append(EmpTitle);
      });
    }
    addRow();
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
