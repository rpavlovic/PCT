/**
 * @module Parse Client Rate Card into a table and save.
 * @version
 */

$.fn.tableToCSV = function () {

  var clean_text = function (text) {
    return text.replace(/"/g, ',').replace(',', '|');
  };

  $(this).each(function () {
    var table = $(this);
    var caption = $(this).find('caption').text();
    var title = [];
    var rows = [];
    $(this).find('tr').each(function () {
      var data = [];
      $(this).find('th').each(function () {
        var text = clean_text($(this).text());
        title.push(text);
      });

      $(this).find('td').each(function () {
        var text = clean_text($(this).text());
        data.push(text);
      });

      data = data.join(",");
      rows.push(data);
    });

    title = title.join(',');
    rows = rows.join('\n').replace(/\n\n/g, '\n');

    var csv = title.trim() + '\n' + rows.trim();
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    var download_link = document.createElement('a');

    var blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});

    download_link.href = uri;
    var ts = new Date();

    function d2(n) {
      return (n < 10 ? "0" : "") + n;
    }

    var ddmmyy = d2(ts.getMonth() + 1) + "_" + ts.getDate() + "_" + ts.getFullYear();
    var formatted_time = new Date().toTimeString().split(' ')[0];
    var input_title = $('#bill-sheet-name').val();

    if (caption === "") {
      download_link.download = input_title + "_" + ddmmyy + "(" + formatted_time + ")" + ".csv";
    } else {
      download_link.download = caption + "-" + ddmmyy + ".csv";
    }

    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, input_title + "_" + ddmmyy + "(" + formatted_time + ")" + ".csv");
    } else {
      document.body.appendChild(download_link);
      download_link.click();
      document.body.removeChild(download_link);
    }
  });

};

$.fn.resourceTableToCSV = function () {

  var clean_text = function (text) {
    text = text.replace(/"/g, ',');
    return '"' + text + '"';
  };

  $(this).each(function () {
    var table = $(this);
    var caption = $(this).find('caption').text();
    var title = [];
    var rows = [];
    $(this).find('thead tr, tbody tr').each(function () {
      var data = [];
      $(this).find('th:not(".hide")').each(function () {
        var text = clean_text($(this).text());
        title.push(text);
      });

      $(this).find('td:not(".hide")').each(function () {
        var text = '';
        if ($(this).has('select').length) {
          text = clean_text($(this).find('select option:selected').text());
        } else {
          if($(this).hasClass('td-billrate') || $(this).hasClass('rate-override') || $(this).hasClass('total-fees') || $(this).hasClass('amount')){
            text = clean_text(convertDecimalToFixed(convertToDecimal($(this).text())));
          }
          else {
            text = clean_text($(this).text());
          }
        }
        data.push(text);
      });

      data = data.join(",");
      rows.push(data);
    });

    $(this).find('tfoot tr').each(function () {
      var data = [];
      if(table.attr('id') === 'project-resource-table') {
        data = ['','','','','','','','','',''];
      }
      if(table.attr('id') === 'project-expense-table') {
        data = ['','','',''];
      }

      $(this).find('th').each(function () {
        var text = '';
        if($(this).hasClass('can-clear') || $(this).hasClass('total-fees')){
          text = clean_text(convertDecimalToFixed(convertToDecimal($(this).text())));
        }else {
          text = clean_text($(this).text());
        }
        data.push(text);
      });

      data = data.join(",");
      rows.push(data);
    });

    title = title.join(',');
    rows = rows.join('\n').replace(/\n\n/g, '\n');

    var csv = title.trim() + '\n' + rows.trim();
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    var download_link = document.createElement('a');

    var blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});

    download_link.href = uri;
    var ts = new Date();

    function d2(n) {
      return (n < 10 ? "0" : "") + n;
    }

    var ddmmyy = d2(ts.getMonth() + 1) + "_" + ts.getDate() + "_" + ts.getFullYear();
    var formatted_time = new Date().toTimeString().split(' ')[0];
    var input_title = $('#bill-sheet-name').val();

    if (caption === "") {
      download_link.download = "projID"+getParameterByName('projID') + "_" + ddmmyy + "(" + formatted_time + ")" + ".csv";
    } else {
      download_link.download = caption + "-" + ddmmyy + ".csv";
    }

    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, "projID"+getParameterByName('projID') + "_" + ddmmyy + "(" + formatted_time + ")" + ".csv");
    } else {
      document.body.appendChild(download_link);
      download_link.click();
      document.body.removeChild(download_link);
    }
  });

};
