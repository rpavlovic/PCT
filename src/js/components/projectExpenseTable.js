/**
 * @module Draw Data Table for Expense page.
 * @version
 */
/*jshint loopfunc: true */
var expenseTable = (function ($) {
  'use strict';

  var projectID = getParameterByName('projID') ? getParameterByName('projID').toString() : '';

  var deliverables,
    expenses,
    table = $('#project-expense-table');

  var deletePayloads = [];
  var categories = [];
  var curr;
  categories.push({
    '0': 'Travel',
    '1': 'OOP',
    '2': '3rd Party Costs',
    '3': 'Freelancers',
    '4': 'Other IPG entities',
    '5': 'Other'
  });

  function initExpenseTable() {
    showLoader();
    var p1 = getProjectDeliverables(projectID);
    var p2 = getProjectExpenses(projectID);
    var p3 = getProjectInfo(projectID);
    var p4 = getOffices();

    Promise.all([p1, p2, p3, p4]).then(function (values) {
      hideLoader();
      var data = [];
      deliverables = values[0];
      expenses = values[1];
      var projectInfo = values[2];
      var offices = values[3];

      curr = projectInfo.Currency ? projectInfo.Currency : 'USD';

      expenses.forEach(function (expense) {
        data.push(expense);
      });

      var projExpenseTable = table.DataTable({
        "dom": '<"toolbar"><B><tip>',
        "searching": false,
        "data": data,
        "paging": false,
        "stateSave": false,
        "info": false,
        "length": false,
        "bFilter": false,
        "select": true,
        "ordering": false,
        "columnDefs": [{
          "orderable": false,
          "targets": [0, 1]
        }],
        "buttons": [
          {
            "extend": 'excel',
            action: function ( e, dt, node, config ) {
              $('#project-expense-table').resourceTableToCSV();
           }
          }
        ],
        "columns": [
          {
            "title": 'Row',
            "sClass": "center rowno",
            "data": "ExpRow",
            "defaultContent": '',
            "render": function (data, type, row, meta) {
              if (data)
                return parseInt(data);
              else
                return meta.row + 1;
            }
          },
          {
            "title": '<i class="fa fa-trash"></i>',
            "sClass": "center blue-bg",
            "targets": [1],
            "data": null,
            "defaultContent": '<a href=" " class="remove"><i class="fa fa-trash"></i></a>'
          },
          {
            "title": 'Deliverable / Work&nbsp;Stream',
            "data": "DelvDesc",
            "defaultContent": '<select class="deliverable">',
            "render": function (data, type, row, meta) {
              return getDeliverablesDropdown(deliverables, row);
            }
          },
          {
            "title": 'Office',
            "defaultContent": '',
            "class": "td-office",
            "sType": "selecttext",
            "render": function (data, type, row, meta) {
              return getOfficesDropdown(offices, row);
            }
          },
          {
            "title": 'Practice',
            "defaultContent": '',
            "class": "td-practice",
            "sType": "selecttext",
            "render": function (data, type, row, meta) {
              return getPractices(projectInfo, row);
            }
          },
          {
            "title": "Category",
            "data": "Category",
            "defaultContent": '',
            "render": function (data, type, set) {
              var output = '<select class="category">';
              $.each(categories, function (key, val) {
                $.each(val, function (k, v) {
                  var selected = val[k] === data ? 'selected="selected"' : '';
                  output += '<option value="' + val[k] + '" ' + selected + '>' + val[k] + '</option>';
                });
              });
              output += '</select>';
              return output;
            }
          },
          {
            "title": "Description",
            "data": "CatDesc",
            "defaultContent": '',
            "render": function (data) {
              return '<div contenteditable onkeypress="return (this.innerText.length <= 39)">' + data + '</div>';
            }
          },
          {
            "title": "Amount",
            "data": "Amount",
            "defaultContent": '',
            "render": function (data, type, set, meta) {
              if(data.length) {
                return '<div contenteditable class="currency-sign ' + curr.toLowerCase() + '">' + convertDecimalToFixed(data) + '</div>';
              }
              else{
                return '<div contenteditable class="currency-sign ' + curr.toLowerCase() + '"></div>';
              }
            }
          }
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          $(nRow).removeClass('odd even');
          $("td:last-child", nRow).addClass('amount num');
          $("td:nth-last-of-type(-n+2)", nRow).addClass("contenteditable");
        },
        "drawCallback": function (row) {
          $('.contenteditable').on('keyup focusout', function (e) {
            recalculateStuff();
          });

          var rowNumber = 1;
          $.each($("#project-expense-table tbody tr"), function(k, v){
            $(v).find('.rowno').text(rowNumber);
            rowNumber++;
          });

        },
        "createdRow": function (row, data, index) {
          $('tfoot th').removeClass('center');
        },
        "initComplete": function (settings, json) {
          setTimeout(recalculateStuff, 1000);
          currencyStyles.initCurrencyStyles(curr);
        },
        "bDestroy": true
      });

      function recalculateStuff() {
        var rows = projExpenseTable.rows();
        var rowSum = 0;

        for (var i = 0; i < rows.context[0].aoData.length; i++) {
          // get sum of the hour column per row
          var amtPerRow = 0;
          for (var j = 5; j < rows.context[0].aoData[i].anCells.length; j++) {

            var amtCells = parseFloat(convertToDecimal($(rows.context[0].aoData[i].anCells[j]).text()));
            amtPerRow += (!isNaN(amtCells) && amtCells.length !== 0) ? amtCells : 0;
            rowSum += amtPerRow;
          }
        }

        if (rowSum) {
          $('tfoot th.total-fees').text(convertToDollar(projectInfo.Currency, rowSum));
        } else {
          $('tfoot th.total-fees').text('');
        }
      }

      //add row
      $('.project-expense').on('click', '#add-row', function (e) {
        e.preventDefault();
        projExpenseTable.rows().nodes().to$().removeClass('new-row');
        projExpenseTable.row.add({
          deliverables: deliverables,
          DelvDesc: '',
          Amount: '',
          CatDesc: ''
        }).draw().node();
        $('#project-expense-table tr:last-child').addClass('new-row');
        currencyStyles.initCurrencyStyles(curr);
      });

      //remove row
      $('#project-expense-table tbody').on('click', '.remove', function (e) {
        e.preventDefault();
        projExpenseTable.row($(this).parents('tr')).remove().draw(false);
        recalculateStuff();
      });

      $('.project-expense #btn-save, .project-expense #btn-save-only').on('click', function (event) {
        event.preventDefault();
        trimInputs();
        console.log("saving expenses form");

        var url = $(this).attr('href');
        $(this).attr('href', updateQueryString('projID', projectID, url) + "&" + getTimestamp());

        var rows = projExpenseTable.rows();
        var payloads = [];

        deleteExpenses();
        payloads = payloads.concat(deletePayloads);

        rows.context[0].aoData.forEach(function (row) {
          payloads.push({
            type: 'POST',
            url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectExpensesCollection',
            data: {
              "__metadata": {
                "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectExpensesCollection('" + projectID + "')",
                "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectExpensesCollection('" + projectID + "')",
                "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectExpenses"
              },
              "ExpRow": padNumber($(row.anCells[0]).text()),
              "Projid": projectID,
              "DelvDesc": $(row.anCells[2]).find('select :selected').val(),
              "Officeid": $(row.anCells[3]).find('select :selected').val(),
              "Category": $(row.anCells[4]).find('select :selected').val().substr(0, 4),
              "CatDesc": $(row.anCells[5]).find('div').text(),
              "Amount": convertToDecimal($(row.anCells[5]).find('div').text()),
              "Currency": curr
            }
          });
          row++;
        });

        ajaxBatch(payloads, $(this).attr('href'), event.target.id === "btn-save");
      });
    });
  }

  function deleteExpenses() {
    var expLength = expenses.length;
    deletePayloads = [];
    while (expLength > $('select.deliverable').length) {
      var expenseId = expLength;
      var targetUrl = "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectExpensesCollection(Projid='" + projectID.toString() + "',ExpRow='" + padNumber(expenseId.toString()) + "')";
      var lookupPayload = deletePayloads.filter(function (val) {
        return val.url === targetUrl;
      });
      // just make sure we don't keep adding the delete payloads.
      if (lookupPayload.length === 0) {
        deletePayloads.push({
          type: 'DELETE',
          url: targetUrl
        });
      }
      expLength--;
    }
  }

  return {
    initExpenseTable: initExpenseTable
  };

})($);
