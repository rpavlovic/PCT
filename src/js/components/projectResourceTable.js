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
        EmpTitle = [];

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
      "ordering" : true,
      "columnDefs": [
        {
          "orderable": false,
          "targets": [ 0, 1 ],
        }
      ],
      "order": [[ 3, 'asc' ]],
      "columns": [ {
        "title": 'Row',
        "class": "center",
        "defaultContent": '',
        "data": null
      },
      {
        "title" : '<i class="fa fa-trash"></i>',
        "class": "center blue-bg",
        "data": null,
        "defaultContent":'<a href=" " class="remove"><i class="fa fa-trash"></i></a>'
      },
      {
        "title": 'Deliverable / Work&nbsp;Stream',
        "data": "Deliverable",
        "defaultContent": '',
        "render": function () {
          if(Deliverable.length > 0) {
           var select = "<select class='deliverable'>";
           $.each(Deliverable, function(key, val){
            select += val;
           });
           select += "</select>";
           return select;
          } else {
            return "<select class='deliverable'/>";
          }
        }
      },
      {
        "title": 'Office',
        "data": "Offices",
        "defaultContent": '',
        "render": function () {
          if(Offices.length > 0) {
           var select = "<select class='office'>";
           $.each(Offices, function(key, val){
            select += val;
           });
           select += "</select>";
           return select;
          } else {
            return "<select class='office'/>";
          }
        }
      },
      {
        "title": 'Title',
        "data": "EmpGradeName",
        "defaultContent": '',
        "render": function (data, type, set) {
          if(EmpTitle.length > 0) {
           var select = "<select class='title'>";
           $.each(EmpTitle, function(key, val) {
            select += val;
           });
           select += "</select>";
           return select;
          } else {
            return "<select class='title'/>";
          }
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
          if(Practice.length > 0) {
           var select = "<select class='practice'>";
           $.each(Practice, function(key, val){
            select += val;
           });
           select += "</select>";
           return select;
          } else {
            return "<select class='practice'/>";
          }
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
        "data": "BillRate",
        "render": function (data) {
          if(EmpTitle.length > 0) {
            loadBillRate();
          } else {
            return "$" + data;
          }

        }
      },
      {
        "title": 'Bill Rate <br/> Override',
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
      "rowCallback": function (row) {
        $(row).removeClass('odd even');
        $("td:nth-child(n+6):not(:nth-child(7)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", row)
          .prop('contenteditable', true)
          .addClass("contenteditable");
      },
      "createdRow": function ( row, data, index ) {
      $('tfoot td').removeClass('center blue-bg rate-override num');
      },
      "initComplete": function (settings, json, row) {
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
// this.options[this.selectedIndex].value === 'US09'
    //get Office name from Office Collection json.
    function getOffices() {
      $.getJSON(get_data_feed(feeds.offices), function(offices) {
        offices.d.results.map(function (val, key) {
           if($.inArray(val.OfficeName, Offices) === -1) {
              Offices.push(val.OfficeName);
              Offices.push('<option value="'+ val.Office +'">'+ val.OfficeName +'</option>');
            }
        });
        $('.office').empty().append(Offices);
      });
    }

    //get deliverables from projectRelatedDeliverables json.
    function getDeliverables() {
      $.getJSON(get_data_feed(feeds.projectDeliverables), function(deliverables) {
        deliverables.d.results.map(function(val, key) {
          if($.inArray(val.DelvDesc, Deliverable) === -1) {
            Deliverable.push(val.DelvDesc);
            Deliverable.push('<option value="'+ key +'">'+ val.DelvDesc +'</option>');
          }
        });
        $('.deliverable').empty().append(Deliverable);
      });
    }
    //get deliverables from projectRelatedDeliverables json
    function getCardBill(data) {
      data.d.results.map(function(val) {
        EmpTitle.push('<option value="' + val.EmpGradeName + '" data-rate="'+ val.BillRate+ '">' + val.EmpGradeName + '</option>');
      });
      $('.title').empty().append(EmpTitle);
      loadBillRate();
    }

    //get deliverables from projectRelatedDeliverables json
    function getPractice(data) {
        data.d.results.map(function(val) {
          if($.inArray(val.CostCenterName, Practice) === -1) {
            Practice.push(val.CostCenterName);
            Practice.push('<option value="'+ val.CostCenterName+ '">'+val.CostCenterName+'</option>');
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
      $('.project-resources').on('click', '#add-row', function(e) {
        e.preventDefault();
        // $(form + "  :input:not(button)")
        projResourceTable.row.add( {
          "EmpGradeName":  EmpTitle,
          "Office": Offices,
          "CostCenterName": Practice,
          "Deliverable": Deliverable
        } ).draw(false).node();
        projResourceTable.rows().nodes().to$().last().addClass('new-row').delay(2000).queue(function(){
          $(this).removeClass("new-row").dequeue();
        });
        // We tell to datatable to refresh the cache with the DOM,
        // like that the filter will find the new data added in the table.
        projResourceTable.row().invalidate('dom').draw();
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
