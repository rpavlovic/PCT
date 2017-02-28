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
        resolve(projects.d.results);
      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectDeliverables, projectId), function (projectDeliverables) {
        resolve(projectDeliverables.d.results);
      });
    });

    var p3 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.marginModeling, projectId, ' '), function (marginModeling) {
        resolve(marginModeling.d.results);
      });
    });

    var p4 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectResources, projectId), function (projectResources) {
        resolve(projectResources.d.results);
      });
    });

    var p5 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectExpenses, projectId), function (projectExpenses) {
        resolve(projectExpenses.d.results);
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
    var project = projectInfo.filter(function (project) {
      return project.Projid === projectId;
    });

    if (project.length) {
      project = project.pop();
      $('#client-name').text(project.Clientname);
      $('#country').text(project.Region);
      $('#office').text(project.Office);
      $('#project-name').text(project.Projname);
      $('#start-date').text(calcPrettyDate(project.EstStDate));
      $('#duration').text(project.Duration);
      $('#comp-type').text(project.Comptyp);
      $('#rate-card').text(project.BillsheetId);
      $('textarea[name="comments"]').text(project.Comments)
    }
  }

  function financialSummaryTable(marginModeling, projectResources, projectExpenses) {
    // console.log(marginModeling);
    // console.log(projectResources);
    // console.log(projectExpenses);

    var ARBF = marginModeling.find(function (val) {
      return val.ModelType === 'ARBF';
    });
    var SRBF = marginModeling.find(function (val) {
      return val.ModelType === 'SRBF';
    });

    var totalExpenses = projectExpenses.reduce(function (acc, val) {
      return acc + parseFloat(val.Amount);
    }, 0);
    // console.log(totalExpenses);
    // console.log(ARBF.Fees);
    // console.log(SRBF.Fees);
    var totalFees = ARBF.Fees ? ARBF.Fees : SRBF.Fees;
    var contributionMargin = ARBF.CtrMargin ? ARBF.CtrMargin : SRBF.CtrMargin;

    var budget = parseFloat(totalFees) + totalExpenses;

    var resourceTotalHours = projectResources.reduce(function (acc, val) {
      return parseFloat(acc) + parseFloat(val.TotalHrs);
    }, 0);

    var netRevenue = budget - totalExpenses;
    var blendedAvg = netRevenue/resourceTotalHours;
    var oopFees = totalExpenses/totalFees;

    // budget = ARBF or SRBF + Expenses
    $('#total-budget').text(budget);
    $('#expenses').text("$(" + totalExpenses + ")");
    $('#net-revenue').text(netRevenue);
    $('#contribution-margin').text(contributionMargin + '%');

    $('#oop-fees').text(oopFees + '%');
    $('#total-hours').text(resourceTotalHours);
    $('#avg-rate').text(blendedAvg);

  }

  return {
    initProjectSummary: initProjectSummary
  };
})($);