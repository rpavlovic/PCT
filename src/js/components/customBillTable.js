/**
 * @module Uploads CSV comma delimetered document into a Client Rate Card.
 * @version
 */
var loadCustomBillSheet = (function ($) {
  'use strict';

  function initLoadCustomBillSheet() {
    var csv_table = $("#csv-table");
    var rcs = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.billSheet), function (plan) {
        resolve(plan.d.results);
      }).fail(function () {
        // not found, but lets fix this and return empty set
        console.log('no custom bill sheet found.... returning empty set');
        resolve([]);
      });
    });

    Promise.all([rcs]).then(function (values) {
      console.log(values);
      var titles = ['Title', 'Grade', 'Rate', 'Currency', 'Upload / Override', 'Discount'];
      populateTable(titles, values[0], false);
    });


    // "EmpNumber": "10000071",
    //   "Class": "E1",
    //   "BillsheetId": "3",
    //   "BillsheetName": "Custom Bill Sheet #2",
    //   "TitleId": "ABCD",
    //   "TitleDesc": "Vice President",
    //   "StandardRate": "100.000",
    //   "OverrideRate": "100.000",
    //   "DiscountPer": "3.560",
    //   "CreatedBy": "VKANDURI",
    //   "CreatedOn": "\/Date(1482796800000)\/",
    //   "ChangedOn": "\/Date(1482796800000)\/",
    //   "ChangedBy": "VKANDURI"
    function populateTable(titles, rows, isUploaded) {
      var columns;
      if (isUploaded) {
        columns = [
          {
            name: "TitleDesc",
            title: titles[0]
          },
          {
            name: "Class",
            title: titles[1]
          },
          {
            name: "StandardRate",
            title: titles[2]
          },
          {
            name: "Currency",
            defaultContent: "USD",
            title: titles[3]
          },
          {
            name: "OverrideRate",
            title: titles[4],
            defaultContent: "<div contenteditable></div>",
            render: function (data, type, row) {
              if (data) {
                return "<div contenteditable>" + data + "</div>";
              }
            }
          },
          {
            title: titles[5]
          }
        ];
      }
      else {
        columns = [
          {
            name: "TitleDesc",
            data: "TitleDesc",
            title: titles[0]
          },
          {
            name: "Class",
            data: "Class",
            title: titles[1]
          },
          {
            name: "StandardRate",
            data: "StandardRate",
            title: titles[2]
          },
          {
            name: "Currency",
            defaultContent: "USD",
            title: titles[3]
          },
          {
            name: "OverrideRate",
            data: "OverrideRate",
            title: titles[4],
            defaultContent: "<div contenteditable></div>",
            render: function (data, type, row) {
              if (data) {
                return "<div contenteditable>" + data + "</div>";
              }
            }
          },
          {
            data: "DiscountPer",
            title: titles[5]
          }
        ];
      }
      csv_table.dataTable({
        dom: '<tip>',
        data: rows,
        select: {
          items: 'cells',
          info: false
        },
        searching: false,
        paging: false,
        length: false,
        order: [[1, 'asc']],
        columns: columns,
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          $(nRow).removeClass('odd even');
          $("td:nth-child(n+5):not(:last-child)", nRow)
            .addClass("contenteditable");
          $("td:nth-child(3)", nRow).addClass('rate num');
          $("td:nth-child(6)", nRow).addClass('discount num');
          $("td:nth-child(5)", nRow).addClass('rate-override num');
        },
        bDestroy: true
      });
    }

    function uploadCSV(data) {
      var newlines = /\r|\n/.exec(data);

      if (newlines) {
        var rows = data.split(/\n/),
          titles = '';
        //get titles from the Excel sheet
        for (var i = rows.length - 1; i >= 1; i--) {
          if (rows[0].indexOf(',') != -1) {
            titles = rows[0].split(/","/g);

            if ($.trim(titles[0]) === "Title") {
              //get titles from the Excel.
              titles[0] = titles[0].replace(/"/g, ",");
              titles[titles.length - 1] = titles[titles.length - 1].replace(/"/g, ",");
            } else {
              //if not preset to defaults.
              titles = ['Title', 'Grade', 'Rate', 'Currency', 'Upload / Override', 'Discount'];
            }
          }
        }
        rows = rows.map(function (row, index) {
          var columns = row.split(",");
          columns[0] = columns[0].replace(/"/g, "");
          columns[columns.length - 1] = columns[columns.length - 1].replace(/"/g, " ");
          return columns;
        });

        //remove the row with titles from the table
        if ($.trim(rows["0"]["0"]) === 'Title') {
          rows.shift();
        }
        populateTable(titles, rows, true);
      }
    }

    // Upload CSV into a table.
    function uploadTable() {
      $("#uploadTable").on('click', function (event, opt_startByte, opt_stopByte) {
        console.log(this);
        $("input[type=\"file\"]").trigger('click', function () {
          event.stopPropagation();
        });

        $("input[type=\"file\"]").on('change', function (evt) {

          var files = evt.target.files,
            file = files[0],
            file_name = file.name,
            start = parseInt(opt_startByte) || 0,
            stop = parseInt(opt_stopByte) || file.size - 1,
            reader = new FileReader();

          reader.onloadend = function (event) {
            if (event.target.readyState == FileReader.DONE) {
              uploadCSV(event.target.result);
            }
          };
          var blob = file.slice(start, stop + 1);

          reader.readAsBinaryString(blob);
          $('#bill-sheet-name').val(file_name.slice(0, -4));
        });
        event.stopPropagation();
      });
    }

    //TODO delete from Server and Profile page.
    $('#DeleteCustomBillSheet').on('click', function () {
      confirm("The template will be deleted and Overrides removed?");
      $("#csv-table tr").each(function (key, value) {
        $(this).find('td.rate-override').empty();
        $(this).find('td.discount').empty();
      });
    });
    uploadTable();

    $('.custom-bill-sheet #btn-save').on('click', function (event) {
      event.preventDefault();
      console.log("saving form");

      var payloads = buildBillSheetPayload();
      $.ajaxBatch({
        url: '/sap/opu/odata/sap/ZUX_PCT_SRV/$batch',
        data: payloads,
        complete: function (xhr, status, data) {
          console.log(data);
          var timeout = getParameterByName('timeout');
          console.log("navigating to new window in" + timeout + "seconds");
          timeout = timeout ? timeout : 1;
          setTimeout(function () {
            //window.location.href = $('#btn-save').attr('href');
          }, timeout);
        },
        always: function (xhr, status, data) {
          var timeout = getParameterByName('timeout');
          console.log("navigating to new window in" + timeout + "seconds");
          timeout = timeout ? timeout : 1;
          setTimeout(function () {
            //window.location.href = $('#btn-save').attr('href');
          }, timeout);
        }
      });
    });

    function buildBillSheetPayload() {
      var csv_table = $("#csv-table").DataTable();
      var rows = csv_table.rows();
      var payloads = [];
      var rowIndex = 1;
      for (var i = 0; i < rows.context[0].aoData.length; i++) {
        var hoursPerRow = 0;
        var cells = $(rows.context[0].aoData[i].anCells);
        console.log(cells);
        var rowId = padNumber(rowIndex, 5);
        var bsId = getParameterByName('CardID');
        payloads.push({
          type: 'POST',
          url: '/sap/opu/odata/sap/ZUX_PCT_SRV/PlannedHoursSet',
          data: {
            "__metadata": {
              "id": "https://fioridev.interpublic.com/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection(BillsheetId='" + bsId +"',RowId='" + rowId + "')",
              "uri": "https://fioridev.interpublic.com/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection(BillsheetId='" + bsId +"',RowId='" + rowId + "')",
              "type": "ZUX_EMPLOYEE_DETAILS_SRV.BillsheetDetails"
            },
            "Class": $(cells[1]).text(),
            "BillsheetId": bsId,
            "BillsheetName": $('#bill-sheet-name').val(),
            "RowId": rowId,
            "TitleId": "2334455",
            "TitleDesc": $(cells[0]).text(),
            "StandardRate": convertToDecimal($(cells[2]).text()),
            "OverrideRate": convertToDecimal($(cells[4]).text()),
            "DiscountPer": convertToDecimal($(cells[5]).text())
          }
        });
        rowIndex++;
      }
      return payloads;
    }
  }

  return {
    initLoadCustomBillSheet: initLoadCustomBillSheet
  };
})($);
