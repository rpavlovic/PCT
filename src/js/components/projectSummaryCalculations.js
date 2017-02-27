/**
 * @module Calulate summary info for each project
 * @version
 */

var projectSummaryCalculations = (function ($) {
  'use strict';

  function calculateBudget(projectId) {
    var pExpenses = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectExpenses, projectId), function (projectDeliverables) {
        resolve(projectDeliverables.d.results);
      });
    });
    var pResources = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectResources, projectId), function (rateCard) {
        resolve(rateCard.d.results);
      });
    });

    return Promise.all([pExpenses, pResources]).then(function (values) {
      var expenses = values[0];
      var resources = values[1];
      var expenseTotal = expenses.reduce(function(acc, val){
        return parseFloat(acc) + parseFloat(val.Amount);
      }, 0);

      var resourceTotalFee = resources.reduce(function(acc, val){
        return parseFloat(acc) + parseFloat(val.TotalFee);
      }, 0);

      return expenseTotal + resourceTotalFee;
    });

  }

  return {
    calculateBudget: calculateBudget
  };
})($);