/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectSummary = (function ($) {
  'use strict';

  var projectId = getParameterByName('projID');

  function initProjectSummary() {

    var p1 = getProjectInfo(projectId);
    var p2 = getProjectDeliverables(projectId);
    var p3 = getMarginModeling(projectId);
    var p4 = getProjectResources(projectId);
    var p5 = getProjectExpenses(projectId);
    var p6 = Promise.all([p4, p1])
      .then(function (values) {
        var resources = values[0];
        var pInfo = values[1];
        var promiseArray = [];
        var officeIds = {};
        resources.forEach(function (val) {
          if (!officeIds[val.Officeid]) {
            officeIds[val.Officeid] = true;
            promiseArray.push(loadRateCardFromServer(val.Officeid, pInfo.Currency));
          }
        });
        return Promise.all(promiseArray)
          .then(function (rateCards) {
            console.log("rateCard with associated offices are loaded");
            return rateCards;
          });
      });
    var p7 = Promise.resolve(p1)
      .then(function (projectInfo) {
        return Promise.resolve(getBillSheet(projectInfo.BillsheetId));
      });

    var p8 = getOffices();

    function loadRateCardFromServer(OfficeId, Currency) {
      var rcLocal = getRateCardLocal(OfficeId, Currency);
      if (rcLocal.length) {
        return {
          OfficeId: OfficeId,
          rateCards: rcLocal
        };
      } else {
        var p = getRateCard(OfficeId, Currency);
        return Promise.resolve(p)
          .then(function (rateCards) {
            sessionStorage.setItem('RateCard' + OfficeId + 'Currency' + Currency, JSON.stringify(rateCards));
            return {
              OfficeId: OfficeId,
              rateCards: rateCards
            };
          });
      }
    }

    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]).then(function (values) {
      var projectInfo = values[0];
      var projectDeliverables = values[1];
      var marginModeling = values[2];
      var projectResources = values[3];
      var projectExpenses = values[4];
      var rateCards = values[5];
      var billSheets = values[6];
      var offices = values[7];

      var office = offices.find(function (val) {
        return val.Office === projectInfo.Office;
      });

      projectInfo.OfficeName = office ? office.OfficeName : projectExpenses.Office;
      projectInfo.BillsheetName = billSheets.length > 0 ? billSheets[0].BillsheetName : '';
      fillProjectInfoSummary(projectInfo);

      var selectedModel = getMarginModel(marginModeling);

      if (projectResources.length) {
        financialSummaryTable(projectInfo, selectedModel, projectResources, projectExpenses);
      }

      summaryDeliverablesTable.initSummaryDeliverablesTable(projectInfo, projectDeliverables, projectResources, projectExpenses, selectedModel);
      summaryOfficeTable.initSummaryOfficeTable(projectInfo, projectResources, rateCards, selectedModel);
      summaryRoleTable.initSummaryRoleTable(projectInfo, projectResources, rateCards, selectedModel);
    });
  }

  function fillProjectInfoSummary(projectInfo) {
    console.log(projectInfo);
    var planBy;
    currencyStyles.initCurrencyStyles(projectInfo.Currency);
    $('#client-name').text(projectInfo.Clientname);
    $('#country').text(projectInfo.Region);
    $('#office').text(projectInfo.OfficeName);
    $('#project-name').text(projectInfo.Projname);
    $('#start-date').text(calcPrettyDate(projectInfo.EstStDate));
    if (projectInfo.Plantyp === "WK") {
      planBy = " Week(s)";
    } else {
      planBy = " Month(s)";
    }
    $('#duration').text(projectInfo.Duration + planBy);
    $('#comp-type').text(projectInfo.Comptyp);
    $('#rate-card').text(projectInfo.BillsheetName);
    $('textarea[name="comments"]').text(projectInfo.Comments);
  }

  function financialSummaryTable(projectInfo, selectedModel, projectResources, projectExpenses) {
    var totalExpenses = projectExpenses.reduce(function (acc, val) {
      return acc + parseFloat(val.Amount);
    }, 0);

    var totalFees;
    var contributionMargin;

    // do math based on the selected model tab..
    if (selectedModel) {
      totalFees = selectedModel.Fees;
      contributionMargin = selectedModel.CtrMargin;
    }

    var budget = parseFloat(totalFees) + totalExpenses;

    var resourceTotalHours = projectResources.reduce(function (acc, val) {
      return parseFloat(acc) + parseFloat(val.TotalHrs);
    }, 0);

    var netRevenue = budget - totalExpenses;
    var blendedAvg = netRevenue / resourceTotalHours;
    var oopFees = totalExpenses / totalFees * 100;
    if (totalFees <= 0) {
      oopFees = 0;
    }

    var class_name = (contributionMargin > 65) ? "high-value" : "low-value";

    // budget = ARBF or SRBF + Expenses
    $('#total-budget').text(convertToDollar(projectInfo.Currency, budget));
    $('#expenses').text(convertToDollar(projectInfo.Currency, totalExpenses)).addClass("low-value");
    $('#net-revenue').text(convertToDollar(projectInfo.Currency, netRevenue));

    $('#contribution-margin').text(contributionMargin + '%').addClass(class_name);

    $('#oop-fees').text(oopFees.toFixed(2) + "%");
    $('#total-hours').text(resourceTotalHours);
    $('#avg-rate').text(convertToDollar(projectInfo.Currency, blendedAvg));

  }

  return {
    initProjectSummary: initProjectSummary
  };
})($);
