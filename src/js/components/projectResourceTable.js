/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */
var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {

    var table = $('#project-resource-table');

    var Offices = [],
        Practice = [],
        Deliverable = [],
        EmpTitle = [],
        BillRate = [];

    var projResourceTable = table.DataTable({
      "searching": false,
      "ajax" : {
        "url": get_data_feed( feeds.rateCards ),
        "dataSrc": "d.results",
      },
      "deferRender": true,
      "paging": false,
      "stateSave": true,
      "info": false,
      "bAutoWidth": false,
      "columnDefs": [
        {
          "orderable": false,
          "targets": [ 0, 1 ],
        }
      ],
      "order": [[ 3, 'asc' ]],
      "columns": [{
        "title": 'Row',
        "sClass": "center",
        "defaultContent": '',
        "data": null
      },
      {
        "title" : '<i class="fa fa-trash"></i>',
        "sClass": "center blue-bg",
        "targets": [1],
        "data": null,
        "defaultContent":'<a href=" " class="remove"><i class="fa fa-trash"></i></a>'
      },
      {
        "title": 'Deliverable / Work&nbsp;Stream',
        "data": null,
        "defaultContent": '',
        "render": function () {
          return "<select class='deliverable' />";
        }
      },
      {
        "title": 'Office',
        "data": null,
        "defaultContent": '',
        "render": function () {
          return '<select class="office" />';
        }
      },
      {
        "title": 'Title',
        "data": null,
        "defaultContent": '',
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
        "data": "CostCenterName",
        "defaultContent": '',
        "render": function () {
          return '<select class="practice">';
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
        "render": function (data) {
          return "$" + data;
        },
        "data": "BillRate"
      },
      {
        "title": 'Bill Rate <br/> Override',
        "data": function ( row, type, val ) {
          if (type === 'set') {
            row.price = val;
            // Store the computed display and filter values for efficiency
            row.price_display = val==="" ? "" : "$"+numberFormat(val);
            row.price_filter  = val==="" ? "" : "$"+numberFormat(val)+" "+val;
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
        "title" : "Cost Bill Rate",
        "data": "CostRate",
        "defaultContent":'',
        "visible": false,
        "render": function (data) {
          return "$" + data;
        }
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
      "rowCallback": function (nRow) {
        $(nRow).removeClass('odd even');
        $("td:nth-child(n+6):not(:nth-child(7)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", nRow)
          .prop('contenteditable', true)
          .addClass("contenteditable");
      },
      "createdRow": function( settings ) {
        // console.log( 'DataTables has redrawn the table' );
      },
      "initComplete": function (settings, json) {
        //get deliverables from json and call function here.
        getDeliverables();

        //get card bill data from json and call function here.
        getCardBill(json);

        //get Offices
        getOffices();

        //get Practice
        getPractice(json);

        this.api().on( 'draw', function () {
          //on selecting title show corresponding bill rate.
          $('select.title').on('change  click', function () {
            loadBillRate();
          });
        });

        //to show a row with indexes.
        projResourceTable.on('order.dt', function () {
          projResourceTable.column(0, {"order" :"applied", "filter":"applied" }).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
          });
        }).draw();

      },
      "bDestroy": true
    });

    //hide the cost rate column
    projResourceTable.column( 11 ).visible( false );

    //get Office name from Office Collection json.
    function getOffices() {
      $.getJSON(get_data_feed(feeds.offices), function(offices) {
        offices.d.results.map(function (value, key) {
           if($.inArray(value.OfficeName, Offices) === -1) {
              Offices.push(value.OfficeName);
              Offices.push($('<option>', { value :key }).text(value.OfficeName));
            }
        });
        $('.office').empty().append(Offices);
      });
    }

    //get deliverables from projectRelatedDeliverables json.
    function getDeliverables() {
      $.getJSON(get_data_feed(feeds.projectDeliverables),  function(deliverables) {
        deliverables.d.results.map(function(val, key) {
          if($.inArray(val.DelvDesc, Deliverable) === -1) {
            Deliverable.push(val.DelvDesc);
            Deliverable.push($('<option>', { value :key }).text(val.DelvDesc));
          }
        });
        $('.deliverable').empty().append(Deliverable);
      });
    }

    //get deliverables from projectRelatedDeliverables json
    function getCardBill(data) {
        data.d.results.map(function(val) {
          BillRate.push(val.BillRate);
          EmpTitle.push($('<option>', { value :val.EmpGradeName , 'data-rate': val.BillRate}).text(val.EmpGradeName));
        });
      $('.title').empty().append(EmpTitle);
      loadBillRate();
    }

    //get deliverables from projectRelatedDeliverables json
    function getPractice(data) {
        data.d.results.map(function(val) {
          if($.inArray(val.CostCenterName, Practice) === -1) {
            Practice.push(val.CostCenterName);
            Practice.push($('<option>', { value :val.CostCenterName }).text(val.CostCenterName));
          }
        });
      $('.practice').empty().append(Practice);
    }

    function loadBillRate() {
     $('select.title').each(function(key, val) {
        $(this).parents('tr').children('td:eq(9)').empty().append("$" + $("option:selected", this).data('rate'));
      });
    }
    //add row
    function addRow() {
      $('.project-resources #add-row').on( 'click', function (e) {
        e.preventDefault();

        projResourceTable.rows().nodes().to$().removeClass( 'new-row' );

        var rowNode = projResourceTable.row.add({
        }).order( [[ 2, 'asc' ],  [ 3, 'asc' ], [ 4, 'asc' ]] ).draw().node();
        $(rowNode).addClass('new-row');
        $('select.title').empty().append(EmpTitle);
        $('.practice').empty().append(Practice);
        getOffices();
        getDeliverables();
        loadBillRate();
      });
    }

    addRow();
    //remove row
    table.on( 'click', '.remove', function (e) {
      e.preventDefault();
      projResourceTable.row( $(this).parents('tr') ).remove().draw(false);
    });

  }
  return {
    initProjectResourceTable:initProjectResourceTable
  };

})($);
