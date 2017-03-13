/**
 * @module Calulate summary info for each project
 * @version
 */

var projectSummaryCalculations = (function ($) {
  'use strict';

  function calculateBudget(projectId) {
    var projectInfo = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.project, projectId), function (projects) {
        // return only 1 project info
        resolve(projects.d.results.find(filterByProjectId, projectId));
      });
    });

    var pExpenses = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectExpenses, projectId), function (projectDeliverables) {
        resolve(projectDeliverables.d.results.filter(filterByProjectId, projectId));
      });
    });
    var pResources = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectResources, projectId), function (rateCard) {
        resolve(rateCard.d.results.filter(filterByProjectId, projectId));
      });
    });

    return Promise.all([projectInfo, pExpenses, pResources]).then(function (values) {
      var projInfo = values[0];
      var expenses = values[1];
      var resources = values[2];

      var expenseTotal = expenses.reduce(function (acc, val) {
        return parseFloat(acc) + parseFloat(val.Amount);
      }, 0);

      var resourceTotalFee = resources.reduce(function (acc, val) {
        return parseFloat(acc) + parseFloat(val.TotalFee);
      }, 0);

      return {
        currency: projInfo.Currency,
        budget: expenseTotal + resourceTotalFee
      };
    });
  }

  return {
    calculateBudget: calculateBudget
  };
})($);
