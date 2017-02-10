/**
 * @module Draw Data Table for Expense page.
 * @version
 */
var expenseTable = (function ($) {
  'use strict';

  function initExpenseTable() {
    var deliverables,
      expenses,
      table = $('#project-expense-table');
    var categories = [];
    categories.push({
      '0': 'Travel',
      '1': 'OOP',
      '2': '3rd Party Costs',
      '3': 'Freelancers',
      '4': 'Other IPG entities',
      '5': 'Other'
    });

    var p1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectDeliverables, getParameterByName('projID')), function (deliverables) {
        resolve(deliverables.d.results);
      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectExpenses, getParameterByName('projID')), function (expenses) {
        resolve(expenses.d.results);
      });
    });

    Promise.all([p1, p2]).then(function (values) {
      deliverables = values[0];
      expenses = values[1];
      var data = [];
      expenses.forEach(function (expense) {
        expense.deliverables = deliverables;
        data.push(expense);
      });

      var projExpenseTable = table.DataTable({
        // "dom":'<tip>',
        "searching": false,
        "data": data,
        "paging": false,
        "stateSave": true,
        "info": false,
        "length": false,
        "bFilter": false,
        "select": true,
        "ordering": false,
        "columnDefs": [{
          "orderable": false,
          "targets": [0, 1]
        }],
        "columns": [{
          "title": 'Row',
          "sClass": "center",
          "defaultContent": '',
          "render": function (data, type, row, meta) {
            return meta.row + 1;
          }
        },
          {
            "title": '<i class="fa fa-trash"></i>',
            "sClass": "center blue-bg",
            "targets": [1],
            "data": null,
            "defaultContent": '<a href=" " class="remove"><i class="fa fa-trash"></i></a>',
          },
          {
            "title": 'Deliverable / Work&nbsp;Stream',
            "data": "deliverables",
            "render": function (data, type, set, meta) {
              var output = '<select class="deliverable">';
              data.forEach(function (deliverable) {
                output += '<option data-delvid="' + deliverable.Delvid + '">' + deliverable.DelvDesc + '</option>';
              });
              output += '</select>';
              return output;
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
            "data": "DelvDesc",
            "defaultContent": '',
            "render": function (data) {
              return '<div contenteditable>' + data + '</div>';
            }
          },
          {
            "title": "Amount",
            "data": "Amount",
            "defaultContent": '',
            "render": function (data) {
              return '<div contenteditable>' + data + '</div>';
            }
          },
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          $(nRow).removeClass('odd even');
          $("td:last-child", nRow).addClass('amount num');
          $("td:nth-last-of-type(-n+2)", nRow)
          // .prop('contenteditable', true)
            .addClass("contenteditable");
        },
        "bDestroy": true
      });

      //add row
      $('.project-expense').on('click', '#add-row', function (e) {
        e.preventDefault();

        projExpenseTable.rows().nodes().to$().removeClass('new-row');
        projExpenseTable.row.add({
          deliverables: deliverables,
          DelvDesc: '',
          Amount: ''
        }).draw().node();

        $('#project-expense-table tr:last-child').addClass('new-row');
      });

      //remove row
      $('#project-expense-table tbody').on('click', '.remove', function (e) {
        e.preventDefault();
        projExpenseTable.row($(this).parents('tr')).remove().draw(false);
      });
    });

  }

  return {
    initExpenseTable: initExpenseTable
  };

})($);
