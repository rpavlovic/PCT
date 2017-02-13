/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {
    var p1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectDeliverables, getParameterByName('projID')), function (deliverables) {
        resolve(deliverables.d.results);
      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.offices), function (offices) {
        resolve(offices.d.results);
      });
    });

    var p3 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.rateCards, getParameterByName('projID')), function (rateCards) {
        resolve(rateCards.d.results);
      });
    });

    var p4 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectResources, getParameterByName('projID')), function (resource) {
        resolve(resource.d.results);
      });
    });

    //fees for modeling table targets
    var t1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.marginModeling, getParameterByName('projID')), function (data) {
        resolve(data.d.results);
      });
    });

    Promise.all([p1, p2, p3, p4, t1]).then(function (values) {
      //deliverables
      var deliverables = values[0];
      var offices = values[1];
      var rateCards = values[2];
      var projectResources = values[3];
      var marginModeling = values[4];

      offices.push({
        Office: "Select Office",
        OfficeName: "Select Office Name",
        City: "Select City"
      });

      var myRows = [];
      var hoursSum = 0;


      projectResources.forEach(function (resource) {
        resource.jan = 40;
        resource.feb = 40;
        resource.mar = 40;
        resource.apr = 40;
        resource.may = 10;
        resource.jun = 20;
        resource.jul = 10;
        resource.aug = 15;
        resource.sep = 20;
        resource.oct = 20;
        resource.nov = 20;
        resource.dec = 20;

        hoursSum += resource.jan + resource.feb + resource.mar + resource.apr + resource.may +
          resource.jun + resource.jul + resource.aug + resource.sep +
          resource.oct + resource.nov + resource.dec;

        console.log(resource);

        myRows.push({
          "EmpGradeName": resource,
          "Deliverables": deliverables,
          "Office": {offices: offices, selectedOffice: getParameterByName('Office')},
          "Role": resource.Role,
          "Class": resource,
          "CostRate": resource,
          "CostCenterName": resource,
          "jan": resource.jan,
          "feb": resource.feb,
          "mar": resource.mar,
          "apr": resource.apr,
          "may": resource.may,
          "jun": resource.jun,
          "jul": resource.jul,
          "aug": resource.aug,
          "sep": resource.sep,
          "oct": resource.oct,
          "nov": resource.nov,
          "dec": resource.dec
        });
      });

      var projResourceTable = $('#project-resource-table').DataTable({
        "searching": false,
        "data": myRows,
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
            "render": function (data, type, row, meta) {
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
                select += '<option value="' + val.Office + '"' + selectString + '>' + val.OfficeName + ', ' + val.City + '</option>';
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
            "render": function (data, type, row, meta) {
              var employeeTitles = getEmployeeTitles(data.Officeid);
              var select = "<select class='title' name='EmpGradeName'>";
              employeeTitles.forEach(function (val) {
                var selectString = data.Titleid === val.EmpGradeName ? 'selected="selected"' : '';
                select += '<option value="' + val.EmpGradeName + '" ' + 'data-rate="' + val.BillRate +
                  '" data-class="' + val.Class + '" data-office="' + val.Office + '" ' +
                  'data-currency="' + val.LocalCurrency + '" ' + selectString + '>' + val.EmpGradeName + '</option>';
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
            "render": function (data, type, row, meta) {
              return getPractices(data);
            }
          },
          {
            "title": 'Role',
            "data": "Role",
            "defaultContent": '<div contenteditable />',
            "render": function (data, type, row, meta) {
              return "<div contenteditable>" + data + "</div>";
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
            "class": "td-billrate can-clear",
            "render": function (data, type, row, meta) {
              return data;
            }
          },
          {
            "title": 'Bill Rate <br/> Override',
            "defaultContent": '<label>$</label><div contenteditable />',
            "sClass": "rate-override num"
          },
          {
            "title": "Cost Rate",
            "data": "CostRate",
            "defaultContent": '<div contenteditable />',
            "visible": getParameterByName('showCostRate'),
            "render": function (data, type, row, meta) {
              var costRate = getCostRate(data);
              return '<div contenteditable>' + costRate + '</div>';
            }
          },
          {
            "title": 'Total Hours',
            "data": "TotalHours",
            "defaultContent": '',
            "class": "total-hours  can-clear",
            "render": function (data, type, row, meta) {
              var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
              var sum = 0;
              months.forEach(function (month) {
                sum += parseFloat(row[month]);
              });
              return !isNaN(sum) ? sum.toFixed(2) : '';
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
            render: renderMonth
          },
          {
            "title": 'FEB <br/> 16',
            "data": "feb",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'MAR <br/> 16',
            "data": "mar",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'APR <br/> 16',
            "data": "apr",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'MAY <br/> 16',
            "data": "may",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'JUN <br/> 16',
            "data": "jun",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'JUL <br/> 16',
            "data": "jul",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'AUG <br/> 16',
            "data": "aug",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'SEP <br/> 16',
            "data": "sep",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'OCT <br/> 16',
            "data": "oct",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'NOV <br/> 16',
            "data": "nov",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          },
          {
            "title": 'DEC <br/> 16',
            "data": "dec",
            "defaultContent": '<div contenteditable />',
            render: renderMonth
          }],
        "bFilter": false,
        "select": true,
        "rowCallback": function (row, json) {
          $(row).removeClass('odd even');
          $("td:nth-child(n+8):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", row)
            .addClass("contenteditable");
        },
        "createdRow": function (row, data, index) {
          $('tfoot td').removeClass('center blue-bg rate-override num');
        },
        "drawCallback": function (row) {
          $("#project-resource-table tbody select.office").on('change', function () {
            console.log("office changed");
            var OfficeID = $(this).val(),
              nodes = $(this);
            getJobTitle(OfficeID, nodes);
          });

          $("#project-resource-table tbody select.title").on('change', function () {
            console.log("title changed");
            var OfficeID = $(this).find(':selected').data('office');
            var nodes = $(this);
            getClass(nodes);
            getPractice(OfficeID, nodes);
            loadBillRate(nodes);
          });
        },
        "initComplete": function (settings, json, row) {
          $('tfoot td.total-hours').text(hoursSum.toFixed(2));
          //calculations for modeling table
          calculateModelingData();
        },
        "bDestroy": true
      });
      function calculateModelingData() {
         var REgex_dollar = /(\d)(?=(\d\d\d)+(?!\d))/g;
        $('#total-fee_target-resource').text("$" + Number(marginModeling[0].Fees).toFixed(2).replace(REgex_dollar, "$1,") );
        $('.contrib-margin').text( Number(marginModeling[0].CtrMargin) + "%");
        var total_hours = $('tfoot td.total-hours').text();
        var avg_rate =  Number(marginModeling[0].Fees)/total_hours;
        var fee_target = $('.fee-target').text();
        $('#avg-rate_target-resource > span').text("$" + avg_rate.toFixed(2).replace(REgex_dollar, "$1,") );
        $('#avg-rate_fixed-resource > span').text("$" + avg_rate.toFixed(2).replace(REgex_dollar, "$1,") );
      }
      function fillTds() {
        $(rateCards).each(function (key, value) {
          $("#project-resource-table tbody select.office option").each(function (k, v) {
            if ($(v).val() === value.Office) {
              $(this).prop('selected', true);
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
          "Office": {offices: offices},
          "CostCenterName": [],
          "Deliverables": deliverables,
          "Class": '',
          "Role": ''
        }).draw().node();
        projResourceTable.rows().nodes().to$().last().addClass('new-row').delay(1000).queue(function () {
          $(this).removeClass("new-row").dequeue();
        });
      });
      //remove row
      $('#project-resource-table tbody').on('click', '.remove', function (e) {
        e.preventDefault();
        projResourceTable.row($(this).parents('tr')).remove().draw(false);
      });

      function getJobTitle(OfficeID, nodes) {
        var titleSelect = nodes.closest('tr').find('.title'),
          EmpTitle = [];
        rateCards.map(function (val) {
          if (OfficeID === val.Office) {
            EmpTitle.push('<option value="' + val.EmpGradeName + '" ' +
              'data-rate="' + val.BillRate + '" data-class="' + val.Class + '" data-office="' + val.Office + '" data-company="' + val.Company + '"' +
              'data-currency="' + val.LocalCurrency + '">' + val.EmpGradeName + '</option>');
          }
        });
        if (EmpTitle.length) {
          EmpTitle.unshift('<option data-class="">Select Title</option>');
        }
        titleSelect.empty().append(EmpTitle);
      }

      function getClass(nodes) {
        nodes.closest('tr').find('.td-class').empty().append(nodes.find(':selected').data('class'));
      }

      //get deliverables from projectRelatedDeliverables json
      function getPractice(OfficeID, nodes) {
        console.log(OfficeID);
        var practiceSelect = nodes.closest('tr').find('.practice');
        var Practice = [];
        rateCards.map(function (val) {
          if (OfficeID === val.Office) {
            Practice.push('<option value="' + val.CostCenterName + '" ' + 'data-office="' + val.Office + '">' + val.CostCenterName + '</option>');
          }
        });
        practiceSelect.empty().append(Practice);
      }

      function loadBillRate(nodes) {
        var tems_currency = {
          'AUD': '$',
          'CAD': '$',
          'CHF': 'CHF',
          'CNY': '¥',
          'EUR': '€',
          'GBP': '£',
          'HKD': '$',
          'JPY': '¥',
          'MYR': 'RM',
          'NZD': '$',
          'SGD': '$',
          'USD': '$'
        };
        var currency = tems_currency[nodes.closest('tr').find('.title :selected').data('currency')];
        nodes.closest('tr').find('.td-billrate').empty().append(currency + nodes.find(':selected').data('rate'));
        //for calculations on resourceCalculation.js file
        resourceCalculation.initResourceFormulas(nodes.closest('tr').find('.td-billrate'), "#project-resource-table");
      }

      function getEmployeeTitles(officeId) {
        var employeeTitles = [];
        employeeTitles.push({Office: null, EmpGradeName: "Select Title"});
        rateCards.map(function (val) {
          if (officeId === val.Office) {
            employeeTitles.push(val);
          }
        });
        return employeeTitles;
      }

      function getEmployeeClass(employee) {
        var rcElement = rateCards.find(function (val) {
          return val.Office === employee.Officeid && employee.Titleid === val.EmpGradeName;
        });
        if (rcElement)
          return rcElement.Class;
        else
          return '';
      }

      function getPractices(employee) {
        var select = "<select class='practice' name='CostCenterName'>";
        select += "<option>Select Practice</option>";

        rateCards.forEach(function (val) {
          var selected = '';
          if (val.Office === employee.Officeid) {
            selected = 'selected="selected" ';
          }
          select += '<option value="' + val.CostCenterName + '" ' + selected + 'data-office="' + val.Office + '">' + val.CostCenterName + '</option>';
        });

        return select;
      }

      function renderMonth(data, type, row, meta) {
        if (data) {
          return '<div contenteditable class="month">' + data + '</div>';
        }
        else {
          return '<div contenteditable class="month" />';
        }
      }

      function getCostRate(resource) {
        var filteredRates = rateCards.filter(function (val) {
          return val.Office === resource.Officeid && val.EmpGradeName === resource.Role;
        });

        console.log(filteredRates[0]);
        if (filteredRates.length > 1) {
          console.log("error, resource matched more than one");
        }

        return filteredRates.pop().CostRate;
      }
    });
  }

  return {
    initProjectResourceTable: initProjectResourceTable
  };
})($);