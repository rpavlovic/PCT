/**
 * @module Uploads CSV comma delimetered document into a Client Rate Card.
 * @version
 */
var loadCustomBillSheet = (function ($) {
  'use strict';

  function initLoadCustomBillSheet() {
    var csv_table = $("#csv-table");
    // get user profile
    showLoader();

    var pProfile = getEmployeeInfo();
    var pOffices = getOffices();
    Promise.all([pProfile, pOffices])
      .then(function (values) {
        var employee = values[0];
        var officeInfo = values[1].find(function (val) {
          return val.Office === employee.Office;
        });

        if (!getParameterByName('CardID')) {
          // we fetch the default rate card, so we can figure out the currency of the user's home office.
          var pRateCards = getRateCard(employee.Office, officeInfo.Currency);
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
        }
        else {
          var rcs = getBillSheet(getParameterByName('CardID'));
          rcs.then(function (values) {
            values = values.map(function (obj) {
              obj.Currency = obj.Currency ? obj.Currency : officeInfo.Currency;
              return obj;
            });
            populateTable(values, false);
          });
        }
      });

    function populateTable(rows, isUploaded) {
      hideLoader();
      //console.log(rows);
      var columns;
      if (isUploaded) {
        columns = [
          {
            "name": "Title",
            "title": "Title"
          },
          {
            "name": "TitleId",
            "title": "TitleId"
          },
          {
            "name": "Class",
            "sType": "rclass",
            "title": "Class"
          },
          {
            "name": "StandardRate",
            "title": "Rate",
            "class": 'rate num'
          },
          {
            "name": "Currency",
            "defaultContent": "USD",
            "title": "Local Currency",
            "render": function (data, type, row) {
              if (data) {
                return data;
              }
            }
          },
          {
            "name": "OverrideRate",
            "title": "Upload / Override",
            "class": 'rate-override num',
            "defaultContent": "<div contenteditable class='currency-sign usd'></div>",
            "render": function (data, type, row) {
              data = parseFloat(data) ? data : '';
              return "<div contenteditable class='currency-sign " + row[4].toLowerCase() + "'>" + data + "</div>";
            }
          },
          {
            "name": "Discount",
            "title": "Discount",
            "class": 'discount num'
          }
        ];
      }
      else {
        columns = [
          {
            "name": "Title",
            "data": "TitleDesc",
            "title": "Title"
          },
          {
            "name": "Title Id",
            "data": "TitleId",
            "title": "Title Id"
          },
          {
            "name": "Class",
            "data": "Class",
            "sType": "rclass",
            "defaultContent": ''
          },
          {
            "name": "StandardRate",
            "data": "StandardRate",
            "title": "Rate",
            "class": 'rate num'
          },
          {
            "name": "Currency",
            "defaultContent": "USD",
            "title": "Local Currency",
            "data": "Currency",
            "render": function (data, type, row) {
              if (data) {
                return "<div class='currency-sign " + row.Currency.toLowerCase() + "'>" + data + "</div>";
              }
            }
          },
          {
            "name": "OverrideRate",
            "class": 'rate-override num',
            "data": "OverrideRate",
            "title": "Upload / Override",
            "defaultContent": "<div contenteditable class='currency-sign usd'></div>",
            "render": function (data, type, row) {
              data = parseFloat(data) ? data : '';
              return "<div contenteditable class='currency-sign " + row.Currency.toLowerCase() + "'>" + data + "</div>";
            }
          },
          {
            "data": "DiscountPer",
            "title": "Discount",
            "class": 'discount num',
            "render": function (data, type, row) {
              return parseFloat(data) ? data + "%" : data;
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
            $('#btn-save, #btn-save-only').prop('disabled', false);
            // $('#btn-save-only').prop('disabled', false);
          } else {
            $('#btn-save, #btn-save-only').prop('disabled', true);
            // $('#btn-save-only').prop('disabled', true);
          }
          if ($('#bill-sheet-name').val()) {
            $('#btn-save, #btn-save-only').prop('disabled', false);
            // $('#btn-save-only').prop('disabled', false);
          }
          $('#bill-sheet-name').on('focusout keypress', function (e) {
            if ($('#bill-sheet-name').val()) {
              $('#btn-save, #btn-save-only').prop('disabled', false);
              // $('#btn-save-only').prop('disabled', false);
            } else {
              $('#btn-save, #btn-save-only').prop('disabled', true);
              // $('#btn-save-only').prop('disabled', true);
            }
          });
        },
        "initComplete": function (settings, json) {
          $(".rate-override div").on('keyup blur', function (e) {
            recalcTable();
          });
          setTimeout(recalcTable, 1000);
        },
        bDestroy: true
      });
    }

    function recalcTable() {
      $('tbody tr[role="row"]').each(function (i, obj) {
        var rate = convertToDecimal($(obj).find('.rate').text());
        var overrideRate = convertToDecimal($(obj).find('.rate-override div').text());
        if (overrideRate > 0) {
          var discount = (rate - overrideRate) / rate;
          $(obj).find('.discount').text(convertToPercent(discount));
        }
        else {
          $(obj).find('.discount').text('');
        }
      });
    }

    function uploadCSV(data) {
      var newlines = /\r|\n/.exec(data);

      if (newlines) {
        var rows = data.split(/\n/);

        // remove title row.
        rows.shift();
        rows = rows.map(function (row, index) {
          var columns = row.split(/,/);
          // convert pipe back to columns
          columns[0] = columns[0].replace(/"/g, "").replace('|', ',');
          columns[columns.length - 1] = columns[columns.length - 1].replace(/"/g, " ");
          return columns;
        });

        // remove rows that are invalid cells
        rows = rows.filter(function (row) {
          return row.length > 5;
        });

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

        if (file_name.length <= 50) {
          $('#bill-sheet-name').val(file_name.slice(0, -4));
        } else {
          $('#bill-sheet-name').val(file_name.substr(0, 50));
          confirm("the file name will be trimmed to 50 characters.");
        }

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

    $('.custom-bill-sheet #btn-save, .custom-bill-sheet #btn-save-only').on('click', function (event) {
      event.preventDefault();
      console.log("saving form");
      var payloads = buildBillSheetPayload();
      if (event.target.id === 'btn-save') {
        ajaxBatch(payloads, 'customBillSheet.htm?CardID=' + bsId, true);
      } else {
        ajaxBatch(payloads, 'customBillSheet.htm?CardID=' + bsId, false);
      }
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
            "Currency": $(cells[4]).text(),
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

    ajaxBatch(deletePayloads, 'customBillSheet.htm');
  }

  return {
    initLoadCustomBillSheet: initLoadCustomBillSheet
  };
})($);
