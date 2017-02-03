/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {

    var table = $('#project-resource-table');

    var Offices = [],
        Deliverable = [],
        loadData;
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
           var select = "<select class='deliverable' name='DelvDesc' >";
           $.each(Deliverable, function(key, val){
            select += val;
           });
           select += "</select>";
           return select;
          } else {
            return "<select class='deliverable' name='DelvDesc'/>";
          }
        }
      },
      {
        "title": 'Office',
        "data": "Offices",
        "defaultContent": '',
        "class": "td-office",
        "render": function () {
          if(Offices.length > 0) {
           var select = "<select class='office' name='Office'>";
           $.each(Offices, function(key, val){
            select += val;
           });
           select += "</select>";
           return select;
          } else {
            return "<select class='office' name='Office' />";
          }
        }
      },
      {
        "title": 'Title',
        "data": "EmpGradeName",
        "defaultContent": '',
        "class": 'td-title',
        "render": function (data, type, set) {
          return "<select class='title' name='EmpGradeName' />";
        }
      },
      {
        "title": 'Class',
        "data":" ",
        "class": "center td-class",
        "defaultContent": '',
        render : function(data, type, row) {
          if(data) {
            return "<div contenteditable />" + data + "</div>";
          }
           else {
            return "<div contenteditable />";
          }
        }
      },
      {
        "title": 'Practice',
        "data": "CostCenterName",
        "defaultContent": '',
        "class":"td-practice",
        "render": function () {
          return "<select class='practice' name='CostCenterName' />";
        }
      },
      {
        "title": 'Role',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'Proposed <br/> Resource',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'Bill Rate',
        "defaultContent": '',
        "data": "BillRate",
        "class": "td-billrate",
      },
      {
        "title": 'Bill Rate <br/> Override',
        "defaultContent": '',
        "sClass": "rate-override num",
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
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
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'FEB <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'MAR <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'APR <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'MAY <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'JUN <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'JUL <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'AUG <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'SEP <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'OCT <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'NOV <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      },
      {
        "title": 'DEC <br/> 16',
        "data":" ",
        "defaultContent": '',
        render : function(data, type, row) {
          return "<div contenteditable />" ;
        }
      }],
      "bFilter": false,
      "select": true,
      "rowCallback": function (row, json) {
        $(row).removeClass('odd even');
        $("td:nth-child(n+6):not(:nth-child(7)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", row)
          // .prop('contenteditable', true)
          .addClass("contenteditable");
      },
      "createdRow": function ( row, data, index ) {
        $('tfoot td').removeClass('center blue-bg rate-override num');
      },
      "drawCallback": function() {
         //get title, Practice per Company Code.
        selectPerCompany();
        //on selecting title show corresponding bill rate.
        $('select.title').on('change', function () {
          loadBillRate();
          loadClass();
          costRate();
        });

      },
      "initComplete": function (settings, json, row) {
        //get deliverables from json and call function here.
        getDeliverables();

        loadData = json;
        var OfficeID;
         loadData.d.results.map(function(val) {
          OfficeID = OfficeID ? OfficeID : val.Office;
        });

         //get Offices
         getOffices();

          projResourceTable.column(4).nodes().each( function (cell, i) {
            getJobTitle(loadData, OfficeID, $(cell).children());
          });
          // get Practice
          projResourceTable.column(6).nodes().each( function (cell, i) {
             getPractice(loadData, OfficeID, $(cell).children());
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
        offices.d.results.map(function (val, key) {
           if($.inArray(val.Office, Offices) === -1) {
              Offices.push('<option value="' + val.Office + '">'+ val.OfficeName + '-' + val.Office + '</option>');
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

    function selectPerCompany() {
      $("#project-resource-table select.office").on('change', function(event) {
         var OfficeID = $(this).val(),
            titleNode = $(this).parent().next().children('.title'),
            practiceNode = $(this).parent().siblings('.td-practice').find('.practice'),
            billRateNode = $(this).parent().siblings('.td-billrate');

          titleNode.empty();
          practiceNode.empty();
          billRateNode.empty();
          getJobTitle(loadData, OfficeID, titleNode);
          getPractice(loadData, OfficeID, practiceNode);
        });
    }

    // Title
    //get deliverables from projectRelatedDeliverables json
    function getJobTitle(data, OfficeID, titleNode) {
      var EmpTitle = [];
      data.d.results.map(function(val) {
        if (OfficeID === val.Office) {
          EmpTitle.push('<option value="' + val.EmpGradeName + '" ' +
                  'data-rate="'+ val.BillRate + '" data-class="'+ val.Class + '" data-company="'+ val.Office +'"' +
                  'data-currency="' + val.LocalCurrency + '">' + val.EmpGradeName + '</option>');
        }
      });

      //picking the corresponding sibling of the Office
      if(titleNode) {
        titleNode.empty().append(EmpTitle);
        loadBillRate();
        loadClass();
      }
    }
    //get deliverables from projectRelatedDeliverables json
    function getPractice(data, OfficeID, practiceNode) {
        var Practice = [];
        data.d.results.map(function(val) {
          if (OfficeID === val.Office) {
            Practice.push('<option value="'+ val.CostCenterName+ '" ' +
                    'data-company="'+ val.Office+'">' +
                    val.CostCenterName+'</option>');
          }
        });
      //picking the corresponding sibling of the Office
      if(practiceNode) {
        practiceNode.empty().append(Practice);
      }
    }

    function loadBillRate() {
     $('select.title').each(function() {
        var currency;
        if($("option:selected", this).data('currency') ) {

        var tems_currency = {
         'AUD':'$',
         'CAD':'$',
         'CHF':'CHF',
         'CNY':'¥',
         'EUR':'€',
         'GBP':'£',
         'HKD':'$',
         'JPY':'¥',
         'MYR':'RM',
         'NZD':'$',
         'SGD':'$',
         'USD':'$'
         };
         for (var key in tems_currency) {
           if($('select.title option:selected').data('currency') === key) {
             currency = tems_currency[key];
           }
         }
       }
       $(this).parent().siblings('.td-billrate').empty().append(currency + $("option:selected", this).data('rate'));
      });
    }

    function loadClass() {
     $('select.title').each(function() {
       $(this).parent().siblings('.td-class').find('div').empty().append($("option:selected", this).data('class'));
      });
    }

    // TODO fill in costRate that is hidden.
    function costRate() {
     $('select.title').each(function(key, val) {
       // console.log($(this).parents('tr').children('td:eq(11)'))
       // $(this).parents('tr').children('td:eq(11)').empty().append($("option:selected", this).data('cost'));
      });
    }

    //add row
    function addRow() {
      $('.project-resources').on('click', '#add-row', function(e) {
        e.preventDefault();
        projResourceTable.row.add( {
          "EmpGradeName": [],
          "Office": Offices,
          "CostCenterName": [],
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
