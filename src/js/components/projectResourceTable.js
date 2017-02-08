/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {

    var p1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectDeliverables), function (deliverables) {
        resolve(deliverables.d.results);
      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.offices), function (offices) {
        resolve(offices.d.results);
      });
    });

    var p3 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.rateCards), function (rateCards) {
        resolve(rateCards.d.results);
      });
    });

    var p4 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectResources), function (resource) {
        resolve(resource.d.results);
      });
    });

    Promise.all([p1, p2, p3, p4]).then(function (values) {

      //deliverables
      var de = values[0];
      var off = values[1];
      var rcs = values[2];
      var rsrc = values[3];
      var All = [];

     $.each(rcs, function (key, value) {
      All.push(value);
     });

    var myRows = [];
      myRows.push({
        "EmpGradeName": All,
        "Office": off,
        "CostCenterName": All,
        "Deliverables": de,
        "rows":rsrc
      });

      var projResourceTable = $('#project-resource-table').DataTable({
        "searching": false,
        "data":myRows,
        "deferRender": true,
        "paging": false,
        "stateSave": true,
        "info": false,
        "bAutoWidth": false,
        "ordering": true,
        "columnDefs": [
          {
            "orderable": false,
            "targets": [0, 1]
          }
        ],
        "order": [[3, 'asc']],
        "columns": [
          {
            "title": 'Row',
            "class": "center",
            "defaultContent": '',
            "data": "counter",
            "render": function (data, type, row, meta) {
              return meta.row + 1;
            }
          },
          {
            "title": '<i class="fa fa-trash"></i>',
            "class": "center blue-bg",
            "data": null,
            "defaultContent": '<a href=" " class="remove"><i class="fa fa-trash"></i></a>'
          },
          {
            "title": 'Deliverable / Work&nbsp;Stream',
            "data": "Deliverables",
            "defaultContent": '',
            "render": function (data, type, set) {
              var select = "<select class='deliverable' name='DelvDesc'>";
              $.each(data, function (key, val) {
                select += '<option>' + val.DelvDesc + '</option>';
              });
              select += "</select>";
              return select;
            }
          },
          {
            "title": 'Office',
            "data": "Office",
            "defaultContent": '',
            "class": "td-office",
            "render": function (data, type, row, meta) {
              var select = "<select class='office' name='Office'>";
              $.each(data, function (key, val) {
                select += '<option value="'+val.Office+'">' + val.OfficeName + ',' + val.City + '</option>';
              });
              select += "</select>";
              return select;
            }
          },
          {
            "title": 'Title',
            "data": "EmpGradeName",
            "defaultContent": '',
            "class": 'td-title',
            // "render": function(data, type, set) {
            //   var select = "<select class='title' name='EmpGradeName'>";
            //     $.each(set.rows, function (key, val) {
            //       $.each(data, function(k, v) {
            //         console.log(v.EmpGradeName);
            //         if(set.rows[key].Officeid === v.Office) {
            //           select += '<option data-office="' + v.Office + '" value="'+v.EmpGradeName+'">' + v.EmpGradeName + '</option>';
            //         }
            //       });
            //     });
            //   select += "</select>";
            //   return select;
            // }
            "render": function (data, type, set) {
              return "<select class='title' name='EmpGradeName' />";
            }
          },
          {
            "title": 'Class',
            "data": " ",
            "class": "center td-class",
            "defaultContent": '',
            render: function (data, type, row) {
              if (data) {
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
            "class": "td-practice",
            "render": function (data, type, set) {
              return "<select class='practice' name='CostCenterName' />";
            }
          },
          {
            "title": 'Role',
            "data": " ",
            "defaultContent": '<div contenteditable />',
          },
          {
            "title": 'Proposed <br/> Resource',
            "data": " ",
            "defaultContent": '<div contenteditable />',
          },
          {
            "title": 'Bill Rate',
            "defaultContent": '',
            "data": "BillRate",
            "class": "td-billrate can-clear"
          },
          {
            "title": 'Bill Rate <br/> Override',
            "defaultContent": '<div contenteditable />',
            "sClass": "rate-override num",
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": "Cost Bill Rate",
            "data": "CostRate",
            "defaultContent": '',
            "visible": false,
            "render": function (data) {
              return "$" + data;
            }
          },
          {
            "title": 'Total Hours',
            "data": " ",
            "defaultContent": '',
            "class": "total-hours  can-clear",
          },
          {
            "title": 'Total Fees',
            "data": " ",
            "defaultContent": '',
            "class": "total-fees  can-clear",
          },
          {
            "title": 'JAN <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="jan month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'FEB <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="feb month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'MAR <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="mar month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'APR <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="apr month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'MAY <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="may month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'JUN <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="jun month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'JUL <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="jul month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'AUG <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="aug month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'SEP <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="sep month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'OCT <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="oct month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'NOV <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="nov month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'DEC <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable class="dec month" />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          }],
        "bFilter": false,
        "select": true,
        "rowCallback": function (row, json) {
          $(row).removeClass('odd even');
          $("td:nth-child(n+6):not(:nth-child(7)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", row)
            .addClass("contenteditable");
        },
        "createdRow": function (row, data, index) {
          $('tfoot td').removeClass('center blue-bg rate-override num');
        },
        "drawCallback": function () {
        },
        "initComplete": function (settings, json, row) {
          setTimeout(function() {
           // $('.project-resources #add-row').trigger('click');
           // fillTds();
          },10);
        },

        "bDestroy": true
      });
      function fillTds() {
        $(rsrc).each(function(key, value) {
          $("#project-resource-table tbody select.office option").each(function(k, v) {
            if($(v).val() === value.Officeid) {
              $(this).prop('selected', true);
              //$("#project-resource-table tbody select.title").trigger('change');
              getJobTitle(value.Officeid, $(this));
              getClass($("#project-resource-table tbody select.title"));
              getPractice(value.Officeid, $(this));
              loadBillRate($("#project-resource-table tbody select.title"));
            }
          });
        });
      }
      //Add Row
      $('.project-resources').on('click', '#add-row', function (e) {
        e.preventDefault();
        projResourceTable.row.add({
          "EmpGradeName": [],
          "Office": off,
          "CostCenterName": [],
          "Deliverables": de
        }).draw().node();
        projResourceTable.rows().nodes().to$().last().addClass('new-row').delay(1000).queue(function () {
            $(this).removeClass("new-row").dequeue();
        });

        // We tell to datatable to refresh the cache with the DOM,
        // like that the filter will find the new data added in the table.
        //projResourceTable.row().invalidate('dom').draw();
        $("#project-resource-table tbody select.title").on('change', function () {
          console.log("title changed");
          var OfficeID = $(this).find(':selected').data('office');
          var nodes = $(this);
          getClass(nodes);
          getPractice(OfficeID, nodes);
          loadBillRate(nodes);
        });
        $("#project-resource-table tbody select.office").on('change', function () {
          console.log("office changed");
          var OfficeID = $(this).val(),
              nodes = $(this);
          getJobTitle(OfficeID, nodes);
        });
      }); //END Add Function.

      //remove row
      $('#project-resource-table tbody').on( 'click', '.remove', function (e) {
        e.preventDefault();
        // projResourceTable.row( $(this).parents('tr') ).node.remove();
        projResourceTable.row( $(this).parents('tr') ).remove().draw(false);
      } );

      function getJobTitle(OfficeID, nodes) {
        var titleSelect = nodes.closest('tr').find('.title'),
            EmpTitle = [];
        //EmpTitle.push('<option>Select Title</option>');
        rcs.map(function (val) {
          if (OfficeID === val.Office) {
            EmpTitle.push('<option value="' + val.EmpGradeName + '" ' +
              'data-rate="' + val.BillRate + '" data-class="' + val.Class + '" data-office="' + val.Office + '" ' +
              'data-currency="' + val.LocalCurrency + '">' + val.EmpGradeName + '</option>');
          }
        });

        titleSelect.empty().append(EmpTitle);
      }

      function getClass(nodes) {
        nodes.closest('tr').find('.td-class div').empty().append(nodes.find(':selected').data('class'));
      }

      //get deliverables from projectRelatedDeliverables json
      function getPractice(OfficeID, nodes) {
        console.log(OfficeID);
        var practiceSelect = nodes.closest('tr').find('.practice');
          var Practice = [];
        //  Practice.push('<option>Select Practice</option>');
          rcs.map(function (val) {
            if (OfficeID === val.Office) {
              Practice.push('<option value="'+ val.CostCenterName+ '" ' +
                      'data-office="'+ val.Office+'">' +
                      val.CostCenterName+'</option>');
            }
          });
          practiceSelect.empty().append(Practice);
      }

      function loadBillRate(nodes) {
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
        var currency = tems_currency[nodes.closest('tr').find('.title :selected').data('currency')];
        nodes.closest('tr').find('.td-billrate').empty().append(currency + nodes.find(':selected').data('rate'));
      }
    });
  }

  return {
    initProjectResourceTable: initProjectResourceTable
  };
})($);