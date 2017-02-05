/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {
    var myD;

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

    Promise.all([p1, p2, p3]).then(function (values) {
      ///console.log(values);
      //deliverables
      var de = values[0];
      var off = values[1];
      var rcs = values[2];

      var myRows = [];
      // add a blank
      off.unshift({});
      myRows.push({
        deliver: de,
        office: off,
        rateCards: rcs
      });


      //console.log(myRows);
      //myRows = Object.values(myRows);
      var projResourceTable = $('#project-resource-table').DataTable({
        "searching": false,
        //  "data": myRows,
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
                select += '<option>' + val.Office + '</option>';
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
            "render": function () {
              return "<select class='practice' name='CostCenterName' />";
            }
          },
          {
            "title": 'Role',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'Proposed <br/> Resource',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'Bill Rate',
            "defaultContent": '',
            "data": "BillRate",
            "class": "td-billrate"
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
            "defaultContent": ''
          },
          {
            "title": 'Total Fees',
            "data": " ",
            "defaultContent": ''
          },
          {
            "title": 'JAN <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'FEB <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'MAR <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'APR <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'MAY <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'JUN <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'JUL <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'AUG <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'SEP <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'OCT <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'NOV <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          },
          {
            "title": 'DEC <br/> 16',
            "data": " ",
            "defaultContent": '<div contenteditable />',
            // render : function(data, type, row) {
            //   return "<div contenteditable />" ;
            // }
          }],
        "bFilter": false,
        "select": true,
        "rowCallback": function (row, json) {
          // $(row).removeClass('odd even');
          // $("td:nth-child(n+6):not(:nth-child(7)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", row)
          // // .prop('contenteditable', true)
          //     .addClass("contenteditable");
        },
        "createdRow": function (row, data, index) {
          // $('tfoot td').removeClass('center blue-bg rate-override num');
        },
        "drawCallback": function () {
        },
        "initComplete": function (settings, json, row) {
        },
        "bDestroy": true
      });


      // $('#project-resource-table tbody').on( 'click', 'td', function () {
      //     var cell_clicked    = projResourceTable.cell(this).data();
      //     var row_clicked     = $(this).closest('tr');
      //     var row_object      = projResourceTable.row(row_clicked).data();
      //
      //     console.log(projResourceTable.cell(this));
      //
      //     console.log(cell_clicked);
      //     console.log(row_clicked);
      //     console.log(row_object);
      // } );

      // $('#project-resource-table tbody').on('click', 'tr', function () {
      //     var index = projResourceTable.row(this).index();
      //     var column = projResourceTable.row(this).column();
      //     var data = projResourceTable.row(this).data();
      //     console.log("row"+ index +", " + column + " clicked");
      //    // alert('You clicked on ' + data[0] + '\'s row' + myro);
      // });
      //
      // $('#project-resource-table tbody').on('change', 'select.office', function () {
      //     var index = projResourceTable.row(this).index();
      //     var column = projResourceTable.row(this).column();
      //     var data = projResourceTable.row(this).data();
      //     console.log("office changed !!");
      //     alert('You clicked on ' + data[0] + '\'s row' + index);
      // });

      $('.project-resources').on('click', '#add-row', function (e) {
        e.preventDefault();
        projResourceTable.row.add({
          "EmpGradeName": [],
          "Office": off,
          "CostCenterName": [],
          "Deliverables": de
        }).draw(false).node();
        // projResourceTable.rows().nodes().to$().last().addClass('new-row').delay(2000).queue(function () {
        //     $(this).removeClass("new-row").dequeue();
        // });
        // We tell to datatable to refresh the cache with the DOM,
        // like that the filter will find the new data added in the table.
        //projResourceTable.row().invalidate('dom').draw();
        $("#project-resource-table tbody select.title").on('change', function () {
          console.log("title changed");
          var nodes = $(this);
          getClass(nodes);
        });
        $("#project-resource-table tbody select.office").on('change', function () {
          console.log("office changed");
          var OfficeID = $(this).val();
          var nodes = $(this);
          //console.log(titleSelect);

          console.log(nodes);
          getJobTitle(OfficeID, nodes);
        });


      });

      function getJobTitle(OfficeID, nodes) {
        var titleSelect = nodes.closest('tr').find('.title');
        var EmpTitle = [];
        EmpTitle.push('<option>Select Title</option>');
        rcs.map(function (val) {
          if (OfficeID === val.Office) {
            EmpTitle.push('<option value="' + val.EmpGradeName + '" ' +
              'data-rate="' + val.BillRate + '" data-class="' + val.Class + '" data-company="' + val.Office + '" ' +
              'data-currency="' + val.LocalCurrency + '">' + val.EmpGradeName + '</option>');
          }
        });

        titleSelect.empty().append(EmpTitle);

        //$(this).parent().siblings('.td-class').find('div').empty().append($("option:selected", this).data('class'));

      }

      function getClass(nodes) {
        nodes.closest('tr').find('.td-class div').empty().append(nodes.find(':selected').data('class'));
      }

    });
  }

  return {
    initProjectResourceTable: initProjectResourceTable
  };
})($);