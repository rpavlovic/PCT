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
      var pProfile = new Promise(function (resolve, reject) {
        $.getJSON(get_data_feed(feeds.employee), function (employees) {
          resolve(employees.d.results[0].Office);
        }).fail(function () {
          console.log("unable to find user profile.");
          reject("error. cant load profile");
        });
      }).then(function (Office) {
        return new Promise(function (resolve, reject) {
          $.getJSON(get_data_feed(feeds.rateCards, Office), function (rcs) {
            var rateCards = rcs.d.results.filter(function (rc) {
              return rc.Office === Office && rc.EmpGradeName;
            });

            var uniqRcs = {};
            rateCards.forEach(function (rc) {
              uniqRcs[rc.EmpGrade] = rc;
            });
            uniqRcs = Object.values(uniqRcs);

            /*  "Class" : "E2",
             "OfficeName" : "WS St. Louis",
             "Office" : "US04",
             "Company" : "US10",
             "CostRate" : "2.000",
             "EmpGradeName" : "Assoc Creative Dir",
             "FiscalYear" : "2017",
             "BillRate" : "260.000",
             "CostCenter" : "US99419900",
             "FiscalPeriod" : "2017002",
             "CostCenterName" : "",
             "EmpGrade" : "990020",
             "LocalCurrency" : "USD"
             */
            uniqRcs = uniqRcs.map(function(obj){
              return {
                TitleDesc: obj.EmpGradeName,
                TitleId: obj.EmpGrade,
                Class: obj.Class,
                StandardRate: obj.BillRate,
                Currency: obj.LocalCurrency,
                DiscountPer: ''
              };
            });
            resolve(uniqRcs);
          }).fail(function () {
            console.log("unable to find user rcs.");
            reject("error. cant load profile");
          });
        });
      }).then(function (res) {
        console.log(res);
        var titles = ['Title', 'Grade', 'Rate', 'Currency', 'Upload / Override', 'Discount'];
        populateTable(titles, res, false);
      });
    }
    else {
      var rcs = new Promise(function (resolve, reject) {
        // we have a card we are trying to Edit
        var BillsheetId = getParameterByName('CardID');
        $.getJSON(get_data_feed(feeds.billSheet, BillsheetId), function (plan) {
          var rcs = plan.d.results.filter(function(val){
            return val.BillsheetId === BillsheetId;
          });

          resolve(rcs);
        }).fail(function () {
          // not found, but lets fix this and return empty set
          console.log('no custom bill sheet found.... returning empty set');

          resolve([]);
        });

      });

      Promise.all([rcs]).then(function (values) {
        console.log(values);
        var titles = ['Title', 'Grade', 'Rate', 'Currency', 'Upload / Override', 'Discount'];
        /*
         BillsheetId:"2"
         BillsheetName:"Custom Bill Sheet"
         ChangedBy:""
         ChangedOn:null
         Class:"M1"
         CreatedBy:"ADULFAN"
         CreatedOn:"/Date(1487721600000)/"
         DiscountPer:"3.560"
         OverrideRate:"100.000"
         RowId:"00002"
         StandardRate:"100.000"
         TitleDesc:"sfsafdsf"
         TitleId:"some title"
         */
        populateTable(titles, values[0], false);
      });
    }

    // get user home office bill rate card

    // go to town...


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
        order: [[0, 'asc']],
        columns: columns,
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          $(nRow).removeClass('odd even');
          $("td:nth-child(n+5):not(:last-child)", nRow)
            .addClass("contenteditable");
          $("td:nth-child(3)", nRow).addClass('rate num');
          $("td:nth-child(6)", nRow).addClass('discount num');
          $("td:nth-child(5)", nRow).addClass('rate-override num');

          //Calculate percentage for the discount.
          $("td:nth-child(5) div", nRow).on('keyup focusout', function (e) {
            if($.isNumeric($(e.target).text()) && $(e.target).text().length > 0) {
              var ovd_rate = $(e.target).text(),
                  st_rate = $(e.target).parent().prevAll('.rate').text().replace(/[^0-9\.]/g,""),
                  minus = st_rate - ovd_rate,
                  percent = ( (st_rate - ovd_rate) / st_rate) * 100;
                  $(e.target).parent().next('.discount').html(percent.toFixed(2)+ "%");
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
        $(this).find('td.contenteditable div').empty();
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
        bsId = bsId ? bsId : get_unique_id();
        payloads.push({
          type: 'POST',
          url: '/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection',
          data: {
            "__metadata": {
              "id": "https://fioridev.interpublic.com/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection(BillsheetId='" + bsId + "',RowId='" + rowId + "')",
              "uri": "https://fioridev.interpublic.com/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection(BillsheetId='" + bsId + "',RowId='" + rowId + "')",
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
