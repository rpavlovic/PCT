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
      var deliverables = values[0];
      var offices = values[1];
      var rateCards = values[2];
      var projectResources = values[3];
      var All = [];

      offices.push({
        Office: "Select Office",
        OfficeName: "Select Office Name",
        City: "Select City"
      });

      var myRows = [];

      projectResources.forEach(function (resource) {
        myRows.push({
          "EmpGradeName": resource,
          "Office": {offices: offices, selectedOffice: getParameterByName('Office')},
          "Class": resource,
          "CostCenterName": [],
          "Role": resource.Role,
          "Deliverables": deliverables,
          "jan": 1,
          "feb": 2,
          "mar": 32,
          "apr": 8,
          "may": 4,
          "jun": 4,
          "jul": 4,
          "aug": 4,
          "sep": 4,
          "oct": 4,
          "nov": 4,
          "dec": 4
        });
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
              var offices = data.offices;
              var select = "<select class='office' name='Office'>";
              $.each(offices, function (key, val) {
                var selectString = data.selectedOffice === val.Office ? 'selected="selected"' : '';
                select += '<option value="' + val.Office + '"'+ selectString +'>' + val.OfficeName + ', ' + val.City + '</option>';
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
            "render": function (data, type, set) {
              var employeeTitles = getEmployeeTitles(data.Officeid);
              var select = "<select class='title' name='EmpGradeName'>";
              $.each(employeeTitles, function (key, val) {
                var selectString = data.Titleid === val.EmpGradeName ? 'selected="selected"' : '';
                select += '<option value="' + val.EmpGradeName + '" ' + 'data-rate="' + val.BillRate +
                  '" data-class="' + val.Class + '" data-company="' + val.Office + '" ' +
                  'data-currency="' + val.LocalCurrency + '" '+ selectString +'>' + val.EmpGradeName + '</option>';
              });
              select += "</select>";
              return select;
            }
          },
          {
            "title": 'Class',
            "data": "Class",
            "class": "center td-class",
            "defaultContent": '',
            render: function (data, type, row) {
              return getEmployeeClass(data);


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
            "data": "Role",
            "defaultContent": '<div contenteditable />',
            "render": function (data, type, set) {
              return "<div contenteditable>"+ data +"</div>";
            }
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
            "data": "TotalHours",
            "defaultContent": '',
            "class": "total-hours  can-clear",
            "render": function (data, type, row, meta) {
              return row.jan + row.feb + row.mar + row.apr + row.may + row.june + row.july + row.aug+ row.sep + row.oct + row.nov + row.dec;
            }
          },
          {
            "title": 'Total Fees',
            "data": " ",
            "defaultContent": '',
            "class": "total-fees  can-clear",
          },
          {
            "title": 'JAN <br/> 16',
            "data": "jan",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'FEB <br/> 16',
            "data": "feb",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'MAR <br/> 16',
            "data": "mar",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'APR <br/> 16',
            "data": "apr",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'MAY <br/> 16',
            "data": "may",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'JUN <br/> 16',
            "data": "jun",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'JUL <br/> 16',
            "data": "jul",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'AUG <br/> 16',
            "data": "aug",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'SEP <br/> 16',
            "data": "sep",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'OCT <br/> 16',
            "data": "oct",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'NOV <br/> 16',
            "data": "nov",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
          },
          {
            "title": 'DEC <br/> 16',
            "data": "dec",
            "defaultContent": '<div contenteditable />',
            render : renderMonth
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
          $("#project-resource-table tbody select.office").on('change', function () {
            console.log("office changed");
            var OfficeID = $(this).val(),
              nodes = $(this);
            getJobTitle(OfficeID, nodes);
          });

          $("#project-resource-table tbody select.title").on('change', function () {
            console.log("title changed");
            var OfficeID = $(this).find(':selected').data('company');
            var nodes = $(this);
            getClass(nodes);
            getPractice(OfficeID, nodes);
            loadBillRate(nodes);
          });
        },
        "initComplete": function (settings, json, row) {
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
          "Office": { offices: offices },
          "CostCenterName": [],
          "Deliverables": deliverables
        }).draw().node();
        projResourceTable.rows().nodes().to$().last().addClass('new-row').delay(1000).queue(function () {
            $(this).removeClass("new-row").dequeue();
        });
      });
      //remove row
      $('#project-resource-table tbody').on( 'click', '.remove', function (e) {
        e.preventDefault();
        projResourceTable.row( $(this).parents('tr') ).remove().draw(false);
      } );

      function getJobTitle(OfficeID, nodes) {
        var titleSelect = nodes.closest('tr').find('.title'),
            EmpTitle = [];
        rateCards.map(function (val) {
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
          rateCards.map(function (val) {
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

      function getEmployeeTitles(officeId){
        var employeeTitles = [];
        employeeTitles.push({ Office: null, EmpGradeName: "Select Title" });
        rateCards.map(function (val) {
          if (officeId === val.Office) {
            employeeTitles.push(val);
          }
        });
        return employeeTitles;
      }

      function getEmployeeClass(employee){
        var rcElement = rateCards.find(function (val) {
          return val.Office === employee.Officeid && employee.Titleid === val.EmpGradeName;
        });

        if(rcElement)
          return rcElement.Class;
        else
          return '';
      }

      function renderMonth(data, type, row, meta) {
        if(data) {
          return '<div contenteditable class="month">' + data + '</div>';
        }
        else{
          return '<div contenteditable class="month"/>';
        }
      }
    });
  }

  return {
    initProjectResourceTable: initProjectResourceTable
  };
})($);