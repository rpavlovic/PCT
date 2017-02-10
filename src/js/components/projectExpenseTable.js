/**
* @module Draw Data Table for Expense page.
* @version
*/
var expenseTable = (function ($) {
  'use strict';

  function initExpenseTable() {

    var Deliverable = [],
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

    var projExpenseTable = table.DataTable({
      // "dom":'<tip>',
      "searching": false,
      "ajax" : {
         "url": get_data_feed( feeds.projectExpenses ),
         "dataSrc": "d.results"
       },
      "paging": false,
      "stateSave": true,
      "info": false,
      "length": false,
      "bFilter": false,
      "select": true,
      "ordering" : false,
      "columnDefs": [ {
        "orderable": false,
        "targets": [ 0, 1 ]
      } ],
      "columns": [{
          "title": 'Row',
          "sClass": "center",
          "defaultContent": '',
          "render": function (data, type, row, meta) {
            return meta.row + 1;
          }
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
          "data": "DelvDesc",
          "render": function ( data, type, set, meta ) {
            var output = '<select class="deliverable">';
            output += '<option>' + data + '</option>';
            output += '</select>';
            return output;
          }
        },
        {
          "title": "Category",
          "data": "Category",
          "defaultContent": '',
          "render": function(data,  type, set) {

            var output = '<select class="category">';

            $.each(categories, function(key, val){
               $.each(val, function(k,v) {
                 var selected = val[k] === data ? 'selected="selected"' : '';
                 output += '<option value="' + val[k] + '" '+ selected+'>' + val[k] + '</option>';
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
          "render": function(data) {
            return '<div contenteditable>' + data + '</div>' ;
          }
        },
        {
          "title": "Amount",
          "data": "Amount",
          "defaultContent": '',
          "render": function(data) {
            return '<div contenteditable>' + data + '</div>' ;
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
      // TODO working on grouping the rows
      // "fnInitComplete": function (nRow, data) {
      //   nRow.aoData.map(function(val, key) {
      //     Deliverable.push($('<option>', { value :key }).text(val._aData.DelvDesc));
      //   });
      //   $('.deliverable').empty().append(Deliverable);
      // },
    "bDestroy": true
  });

    //add row
  $('.project-expense').on( 'click', '#add-row', function (e) {
    e.preventDefault();

    projExpenseTable.rows().nodes().to$().removeClass( 'new-row' );

    var rowNode = projExpenseTable.row.add([]).order( [[ 2, 'asc' ]] ).draw(false).node();
    $('.deliverable').empty().append(Deliverable);
    $('#project-expense-table tr:last-child').addClass('new-row');
  });
  //remove row
  $('#project-expense-table tbody').on( 'click', '.remove', function (e) {
    e.preventDefault();
    projExpenseTable.row( $(this).parents('tr') ).remove().draw(false);
  });
  }
  return {
    initExpenseTable:initExpenseTable
  };

})($);
