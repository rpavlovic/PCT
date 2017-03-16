/**
 * @module Uploads CSV comma delimetered document into a Client Rate Card.
 * @version
 */
var loadCustomBillSheet = (function ($) {
  'use strict';

  function initLoadCustomBillSheet() {
    var csv_table = $("#csv-table");
    // get user profile

    if (!getParameterByName('CardID')) {
      var pProfile = getEmployeeInfo();
      pProfile.then(function (employee) {
        var Office = employee.Office;
        var pRateCards = getRateCard(Office);
        pRateCards.then(function (rateCards) {
          var uniqRcs = {};
          rateCards.forEach(function (rc) {
            uniqRcs[rc.EmpGrade] = rc;
          });

          uniqRcs = Object.values(uniqRcs).map(function (obj) {
            return {
              TitleDesc: obj.EmpGradeName,
              TitleId: obj.EmpGrade,
              Class: obj.Class,
              StandardRate: obj.BillRate,
              Currency: obj.LocalCurrency,
              DiscountPer: ''
            };
          }).sort(function (a, b) {
            return (a.TitleDesc > b.TitleDesc) ? 1 : ((b.TitleDesc > a.TitleDesc) ? -1 : 0);
          });
          populateTable(uniqRcs, false);
        });
      });
    }
    else {
      var rcs = getBillSheet(getParameterByName('CardID'));
      rcs.then(function (values) {
        populateTable(values, false);
      });
    }

    function populateTable(rows, isUploaded) {
      //console.log(rows);
      var columns;
      if (isUploaded) {
        columns = [
          {
            name: "Title",
            title: "Title"
          },
          {
            name: "TitleId",
            //     visible: false,
            title: "TitleId"
          },
          {
            name: "Class",
            title: "Class"
          },
          {
            name: "StandardRate",
            title: "Standard Rate"
          },
          {
            name: "Currency",
            defaultContent: "USD",
            title: "Currency"
          },
          {
            name: "OverrideRate",
            title: "Upload / Override",
            defaultContent: "<div contenteditable class='currency-sign usd'></div>",
            render: function (data, type, row) {
              if (data) {
                return "<div contenteditable class='currency-sign usd'>" + data + "</div>";
              }
            }
          },
          {
            name: "Discount",
            title: "Discount"
          }
        ];
      }
      else {
        columns = [
          {
            name: "Title",
            data: "TitleDesc",
            title: "Title"
          },
          {
            name: "Title Id",
            data: "TitleId",
            // visible: true,
            title: "Title Id"
          },
          {
            name: "Class",
            data: "Class",
            title: "Class"
          },
          {
            name: "StandardRate",
            data: "StandardRate",
            title: "Rate",
            class: 'rate num'
          },
          {
            name: "Currency",
            defaultContent: "USD",
            title: "Currency"
          },
          {
            name: "OverrideRate",
            class: 'rate-override num',
            data: "OverrideRate",
            title: "Upload / Override",
            defaultContent: "<div contenteditable class='currency-sign usd'></div>",
            render: function (data, type, row) {
              if (parseFloat(data)) {
                return "<div contenteditable class='currency-sign usd'>" + data + "</div>";
              }
            }
          },
          {
            data: "DiscountPer",
            title: "Discount",
            class: 'discount num',
            render: function (data, type, row) {
              if (data) {
                return data + "%";
              }
              return data;
            }
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
        order: [[0, 'asc']],
        columns: columns,
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          $(nRow).removeClass('odd even');
          $("td:nth-child(n+6):not(:last-child)", nRow)
            .addClass("contenteditable");
          floatLabel.initfloatLabel();
          //populate input field with Billsheet Name.
          if (aData.BillsheetName) {
            $('#bill-sheet-name').val(aData.BillsheetName);
            $('#btn-save').prop('disabled', false);
          } else {
            $('#btn-save').prop('disabled', true);
          }

          $('#bill-sheet-name').on('focusout keypress', function (e) {
            if ($('#bill-sheet-name').val()) {
              $('#btn-save').prop('disabled', false);
            } else {
              $('#btn-save').prop('disabled', true);
            }
          });

          //Calculate percentage for the discount.
          $("td:nth-child(6) div", nRow).on('keyup focusout', function (e) {
            if ($.isNumeric($(e.target).text()) && $(e.target).text().length > 0) {
              var ovd_rate = $(e.target).text(),
                st_rate = $(e.target).parent().prevAll('.rate').text().replace(/[^0-9\.]/g, ""),
                minus = st_rate - ovd_rate,
                percent = ( (st_rate - ovd_rate) / st_rate) * 100;
              $(e.target).parent().next('.discount').html(percent.toFixed(3) + "%");
            }
            else {
              $(e.target).parent().next('.discount').empty();
            }
          });
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
            }
          }
        }
        rows = rows.map(function (row, index) {
          var columns = row.split('","');
          columns[0] = columns[0].replace(/"/g, "");
          columns[columns.length - 1] = columns[columns.length - 1].replace(/"/g, " ");
          return columns;
        });

        //remove the row with titles from the table
        if ($.trim(rows["0"]["0"]) === 'Title') {
          rows.shift();
        }
        populateTable(rows, true);
      }
    }

    $('#downloadTemplate').on('click', function (e) {
      csv_table.tableToCSV();
    });

    // Upload CSV into a table.
    $("#uploadTable").on('click', function (event, opt_startByte, opt_stopByte) {

      $("#fileinput").trigger('click', function () {
        event.stopPropagation();
      });

      $("#fileinput").on('change', function (evt) {
        var files = evt.target.files,
          file = files[0],
          file_name = file.name,
          start = parseInt(opt_startByte) || 0,
          stop = parseInt(opt_stopByte) || file.size - 1,
          reader = new FileReader();

        reader.onloadend = function (event) {
          if (event.target.readyState == FileReader.DONE) {
            uploadCSV(reader.result);
          }
        };
        var blob = file.slice(start, stop + 1);
        reader.readAsText(blob);

        $('#bill-sheet-name').val(file_name.slice(0, -4));
      });
      event.stopPropagation();
    });

    $('#DeleteCustomBillSheet').on('click', function () {
      var confirmDelete = confirm("Are you sure you want to delete this Custom Rate Card?");
      if (confirmDelete) {
        console.log("deleting this sheet");
        deleteBillSheet();
      }
    });

    $('.custom-bill-sheet #btn-save').on('click', function (event) {
      event.preventDefault();
      console.log("saving form");

      var payloads = buildBillSheetPayload();
      $.ajaxBatch({
        url: '/sap/opu/odata/sap/ZUX_PCT_SRV/$batch',
        data: payloads,
        complete: function (xhr, status, data) {
          var timeout = getParameterByName('timeout');
          console.log("navigating to new window in" + timeout + "seconds");
          timeout = timeout ? timeout : 1;
          setTimeout(function () {
            // where do they go after they save a sheet?
            window.location.href = 'customBillSheet.htm?CardID=' + bsId;
          }, timeout);
        },
        always: function (xhr, status, data) {
          var timeout = getParameterByName('timeout');
          console.log("navigating to new window in" + timeout + "seconds");
          timeout = timeout ? timeout : 1;
          setTimeout(function () {
            if(!is_fiori()) { window.location.href = 'customBillSheet.htm?CardID=' + bsId; }
          }, timeout);
        }
      });
    });

    var bsId;

    function buildBillSheetPayload() {
      var csv_table = $("#csv-table").DataTable();
      var rows = csv_table.rows();
      var payloads = [];
      var rowIndex = 1;

      bsId = getParameterByName('CardID');
      bsId = bsId ? bsId : get_unique_id();

      for (var i = 0; i < rows.context[0].aoData.length; i++) {
        var hoursPerRow = 0;
        var cells = $(rows.context[0].aoData[i].anCells);
        //console.log(cells);
        var rowId = padNumber(rowIndex, 5);
        var StandardRate = convertToDecimal($(cells[3]).text()) ? convertToDecimal($(cells[3]).text()) : "0.0";
        var OverrideRate = convertToDecimal($(cells[5]).text()) ? convertToDecimal($(cells[5]).text()) : "0.0";
        var DiscountPer = convertToDecimal($(cells[6]).text()) ? convertToDecimal($(cells[6]).text()) : "0.0";

        payloads.push({
          type: 'POST',
          url: '/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection',
          data: {
            "__metadata": {
              "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection(BillsheetId='" + bsId + "',RowId='" + rowId + "')",
              "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection(BillsheetId='" + bsId + "',RowId='" + rowId + "')",
              "type": "ZUX_EMPLOYEE_DETAILS_SRV.BillsheetDetails"
            },
            "Class": $(cells[2]).text(),
            "BillsheetId": bsId,
            "BillsheetName": $('#bill-sheet-name').val(),
            "RowId": rowId,
            "TitleId": $(cells[1]).text(),
            "TitleDesc": $(cells[0]).text(),
            "StandardRate": StandardRate,
            "OverrideRate": OverrideRate,
            "DiscountPer": DiscountPer
          }
        });
        rowIndex++;
      }
      return payloads;
    }
  }

  function deleteBillSheet() {
    var bsId = getParameterByName('CardID');

    var deletePayloads = [];
    for (var i = 1; i <= $("#csv-table tbody tr").length; i++) {
      var rowId = padNumber(i, 5);
      var targetUrl = "/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection(BillsheetId='" + bsId + "',RowId='" + rowId + "')";
      // just make sure we don't keep adding the delete payloads.
      deletePayloads.push({
        type: 'DELETE',
        url: targetUrl
      });
    }

    $.ajaxBatch({
      url: '/sap/opu/odata/sap/ZUX_PCT_SRV/$batch',
      data: deletePayloads,
      complete: function (xhr, status, data) {
        var timeout = getParameterByName('timeout');
        console.log("navigating to new window in" + timeout + "seconds");
        timeout = timeout ? timeout : 1;
        setTimeout(function () {
          console.log(!is_fiori());
          window.location.href = 'customBillSheet.htm';
        }, timeout);
      },
      always: function (xhr, status, data) {
        var timeout = getParameterByName('timeout');
        console.log("navigating to new window in" + timeout + "seconds");
        timeout = timeout ? timeout : 1;
        setTimeout(function () {
          console.log(!is_fiori());
           if(!is_fiori()) { window.location.href = 'customBillSheet.htm'; }
        }, timeout);
      }
    });
  }

  return {
    initLoadCustomBillSheet: initLoadCustomBillSheet
  };
})($);
