/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectSummary = (function ($) {
  'use strict';

  var projectId = getParameterByName('projID');


  function initProjectSummary() {

    var p1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.project, projectId), function (projects) {
        resolve(projects.d.results.find(filterByProjectId, projectId));
      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectDeliverables, projectId), function (projectDeliverables) {
        resolve(projectDeliverables.d.results.filter(filterByProjectId, projectId));
      });
    });

    var p3 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.marginModeling, projectId, ' '), function (marginModeling) {
        resolve(marginModeling.d.results.filter(filterByProjectId, projectId));
      });
    });

    var p4 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectResources, projectId), function (projectResources) {
        resolve(projectResources.d.results.filter(filterByProjectId, projectId));
      });
    });

    var p5 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectExpenses, projectId), function (projectExpenses) {
        resolve(projectExpenses.d.results.filter(filterByProjectId, projectId));
      });
    });

    var p6 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.offices), function (offices) {
        resolve(offices.d.results);
      });
    });

    function loadRateCardFromServer(OfficeId) {
      return new Promise(function (resolve, reject) {
        //console.log('RateCard Not found. checking service for OfficeId' + OfficeId);
        $.getJSON(get_data_feed(feeds.rateCards, OfficeId), function (rateCards) {
          var rcs = rateCards.d.results.filter(function (val) {
            // add in any filtering params if we need them in the future
            return parseInt(val.CostRate) > 0 && val.EmpGradeName;
          });

          var rc = {
            OfficeId: OfficeId,
            rateCards: rateCards.d.results
          };

          resolve(rc);
        }).fail(function () {
          // not found, but lets fix this and return empty set
          console.log('no rate cards found.... returning empty set');
          resolve([]);
        });
      });
    }

    var p7 = Promise.resolve(p4)
      .then(function (resources) {
        var promiseArray = [];
        var officeIds = {};
        resources.forEach(function (val) {
          if (!officeIds[val.Officeid]) {
            officeIds[val.Officeid] = true;
            promiseArray.push(loadRateCardFromServer(val.Officeid));
          }
        });
        return Promise.all(promiseArray)
          .then(function (rateCards) {
            console.log("rateCard with associated offices are loaded");
            return rateCards;
          });
      });

    Promise.all([p1, p2, p3, p4, p5, p6, p7]).then(function (values) {
      var projectInfo = values[0];
      var projectDeliverables = values[1];
      var marginModeling = values[2];
      var projectResources = values[3];
      var projectExpenses = values[4];
      var offices = values[5];
      var rateCards = values[6];

      fillProjectInfoSummary(projectInfo);
      financialSummaryTable(marginModeling, projectResources, projectExpenses);
      summaryDeliverablesTable.initSummaryDeliverablesTable(projectDeliverables, projectResources, projectExpenses);
      summaryOfficeTable.initSummaryOfficeTable(projectResources, offices, rateCards);
      summaryRoleTable.initSummaryRoleTable(projectResources, rateCards);
    });
  }

  function fillProjectInfoSummary(projectInfo) {
    currencyStyles.initCurrencyStyles(projectInfo.Currency);
    $('#client-name').text(projectInfo.Clientname);
    $('#country').text(projectInfo.Region);
    $('#office').text(projectInfo.Office);
    $('#project-name').text(projectInfo.Projname);
    $('#start-date').text(calcPrettyDate(projectInfo.EstStDate));
    $('#duration').text(projectInfo.Duration);
    $('#comp-type').text(projectInfo.Comptyp);
    $('#rate-card').text(projectInfo.BillsheetId);
    $('textarea[name="comments"]').text(projectInfo.Comments);
  }

  function financialSummaryTable(marginModeling, projectResources, projectExpenses) {
    var ModelType;

    var ARBF = marginModeling.find(function (val) {
      return val.ModelType === 'ARBF';
    });
    var SRBF = marginModeling.find(function (val) {
      return val.ModelType === 'SRBF';
    });

    var TMBF = marginModeling.find(function (val) {
      return val.ModelType === 'TMBF';
    });
    var FFT = marginModeling.find(function (val) {
      return val.ModelType === 'FFT';
    });

    var totalExpenses = projectExpenses.reduce(function (acc, val) {
      return acc + parseFloat(val.Amount);
    }, 0);

    var totalFees;
    var contributionMargin;

    if (FFT.Fees > 0) {
      totalFees = FFT.Fees;
    } else if (TMBF.Fees > 0) {
      totalFees = TMBF.Fees;
    } else if (ARBF.Fees > 0) {
      totalFees = ARBF.Fees;
    } else if (SRBF.Fees > 0) {
      totalFees = SRBF.Fees;
    }

    if (FFT.CtrMargin > 0) {
      contributionMargin = FFT.CtrMargin;
    } else if (TMBF.CtrMargin > 0) {
      contributionMargin = TMBF.CtrMargin;
    } else if (ARBF.CtrMargin > 0) {
      contributionMargin = ARBF.CtrMargin;
    } else if (SRBF.CtrMargin > 0) {
      contributionMargin = SRBF.CtrMargin;
    }

    var budget = parseFloat(totalFees) + totalExpenses;

    var resourceTotalHours = projectResources.reduce(function (acc, val) {
      return parseFloat(acc) + parseFloat(val.TotalHrs);
    }, 0);

    var netRevenue = budget - totalExpenses;
    var blendedAvg = netRevenue / resourceTotalHours;
    var oopFees = totalExpenses / totalFees;
    if (totalFees <= 0) {
      oopFees = 0;
    }
    var class_name = '';

    if (contributionMargin > 65) {
      class_name = "high-value";
    } else {
      class_name = "low-value";
    }
    // budget = ARBF or SRBF + Expenses
    $('#total-budget').text(convertToDollar(budget));
    $('#expenses').text(convertToDollar(totalExpenses)).addClass("low-value");
    $('#net-revenue').text(convertToDollar(netRevenue));

    $('#contribution-margin').text(contributionMargin + '%').addClass(class_name);

    $('#oop-fees').text(oopFees.toFixed(2) + "%");
    $('#total-hours').text(resourceTotalHours);
    $('#avg-rate').text(convertToDollar(blendedAvg));

  }

  return {
    initProjectSummary: initProjectSummary
  };
})($);
