/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var activeTableFunction = (function ($) {
  'use strict';

  $('#start-project').on('click', function (e) {
    e.preventDefault();
    window.location.href = 'projectGeneral.htm?projID=' + get_project_id();
  });

  function initActiveTable() {
    var table = $('#active-projects');

    var p1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.offices), function (offices) {
        resolve(offices.d.results);
      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectList), function (projects) {
        resolve(projects.d.results);
      }).fail(function () {
        // not found, but lets fix this and return empty set
        console.log('no projects found.... returning empty set');
        resolve([]);
      });
    });

    Promise.all([p1, p2])
      .then(function (values) {
        var curr;
        var offices = values[0];
        var projects = values[1];
        projects.forEach(function (proj) {
          var office = offices.find(function (val) {
            return val.Office === proj.Office;
          });
          var officeName = office ? office.OfficeName : proj.Office;
          var planType = proj.Plantyp === 'WK' ? ' Weeks' : ' Months';
          proj.Duration = proj.Duration + planType;
          proj.Office = officeName;
          curr = proj.Currency;
        });

        var activeTable = table.DataTable({
          "sDom": '<"toolbar"><B><tip>',
          "searching": true,
          "data": projects,
          "bServerSide": false,
          "iDisplayLength": 10,
          "bAutoWidth": false,
          "stateSave": false,
          "columnDefs": [{
            "orderable": false,
            "targets": [5, 6]
          }],
          "columns": [
            {
              "title": 'Project Name',
              "data": "Projname",
              "render": function (data, type, set, meta) {
                if (data) {
                  var output = '<a href="projectGeneral.htm?projID=' + set.Projid + '&projName=' + data + '" title="ProjectName">';
                  output += data;
                  output += '</a>';
                  return output;
                }
              }
            },
            {
              "title": 'Billing Office',
              "data": "Office"
            },
            {
              "title": 'Est.Date',
              "data": "EstStDate",
              "defaultContent": '',
              "render": function (data, type) {
                var str = data;
                var num = parseInt(str.replace(/[^0-9]/g, ""));
                var date = new Date(num);
                if (type === 'display' || type === 'filter') {
                  var d = date;
                  return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                }
                // Otherwise the data type requested (`type`) is type detection or
                // sorting data, for which we want to use the integer, so just return
                // that, unaltered
                return data;
              }
            },
            {
              "title": 'Duration',
              "data": "Duration",
              "defaultContent": ''
            },
            {
              "title": 'Budget',
              "data": 'Projid',
              "defaultContent": '',
              "class": 'budget',
              "render": function (data, type, set, meta) {
                currencyStyles.initCurrencyStyles(set.Currency);
                if (data) {
                  return '<div data-val="' + data + '">' + data + '</div>';
                }
              }
            },
            {
              "title": '<i class="fa fa-files-o"></i>',
              "class": "center blue-bg",
              "data": "Projid",
              "defaultContent": '',
              "render": function (data, type, set, meta) {
                if (data) {
                  return '<a href="projectGeneral.htm?projID=' + data + '&projName=' + set.Projname + '" class=""><i class="fa fa-files-o"></i></a>';
                }
              }
            },
            {
              "title": '<i class="fa fa-trash"></i>',
              "class": "center blue-bg",
              "data": "Projid",
              "defaultContent": '<a href="" class="remove"><i class="fa fa-trash"></i></a>',
              "render": function (data, type, set, meta) {
                if (data) {
                  return '<a href="" data-projid="' + data + '" class="remove"><i class="fa fa-trash"></i></a>';
                }
              }
            }
          ],
          "bFilter": true,
          "select": true,
          "buttons": [
            'copy', 'csv', 'excel',
            {
              "extend": 'pdf',
              "download": 'open'
            }
          ],
          "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $(nRow).removeClass('odd even');
          },
          //when json is loaded add the filters to the toolbar div.
          "initComplete": function (nRow) {
            // currencyStyles.initCurrencyStyles(curr);
            this.api().columns().every(function (index, fn) {
              var column = this;
              var field_wrapper = $('<div class="field-wrapper"></div>');
              var label = $('<label for="search_' + index + '" class="show">Filter</label>');
              if (index < 5) {
                var select = $('<select name="search_' + index + '" selected><option value=""></option></select>')
                  .appendTo("div.toolbar")
                  .on('change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                      $(this).val()
                    );
                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                  });

                select.wrap(field_wrapper);
                label.insertBefore(select);
                //create filters
                column.data().unique().sort().each(function (d) {
                  if (typeof d === 'string' && d.indexOf('/Date') != -1) {
                    var str = d;
                    var num = parseInt(str.replace(/[^0-9]/g, ""));
                    d = new Date(num);
                    d = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                  }
                  select.append('<option value="' + d + '">' + d + '</option>');
                });
              }
            });
            $('.toolbar').hide();

            // calculate the budget after the fact
            calculateBudgets();
          },
          "bDestroy": true
        });

        $('.search-table').on('keyup change search', function (e) {
          activeTable.search(this.value).draw();
        });

        // $( '.buttons-page-length' ).insertAfter('#active-projects_wrapperarchived-projects_wrapper').wrap("<div class=\"dt-buttons\" />").addClass('float-right');
        $('#active-projects tbody').on('click', '.remove', function (e) {
          e.preventDefault();
          var r = confirm("Are you sure you want to delete this project?");
          var currentRow = $(this);
          if (r === true) {
            var projectId = $(this).data('projid');
            $.ajax({
              url: "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection('" + projectId + "')",
              type: 'DELETE',
              success: function (result) {
                // Do something with the result
                activeTable.row(currentRow.parents('tr')).remove().draw();
              }
            });
          }
        });

        $('#active-projects').on('draw.dt', function () {
          calculateBudgets();
        });

      });

    function calculateBudgets() {
      $('#active-projects tbody td.budget div').each(function (k, v) {
        if ($(v).data('val')) {
          var p = projectSummaryCalculations.calculateBudget($(v).data('val').toString());
          p.then(function (results) {
            $(v).data('val', '');
            $(v).text(convertToDollar(results.currency, results.budget));
          });
        }
      });
    }
  }

  return {
    initActiveTable: initActiveTable
  };
})($);
