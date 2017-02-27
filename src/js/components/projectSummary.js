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
      $.getJSON(get_data_feed(feeds.projectDeliverables), function (projectDeliverables) {
        resolve(projectDeliverables.d.results);
      });
    });

    var p3 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.marginModeling, projectId), function (marginModeling) {
        resolve(marginModeling.d.results);
      });
    });

    var p4 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectResources, projectId), function (rateCard) {
        resolve(rateCard.d.results);
      });
    });

    var p5 = projectSummaryCalculations.calculateFinancialSummary(projectId);

    Promise.all([p1, p2, p3, p4, p5]).then(function (values) {
      //deliverables
      var projectInfo = values[0];
      var projectDeliverables = values[1];
      var marginModeling = values[2];
      var projectResources = values[3];
      var financialSummary = values[4];


      fillProjectInfoSummary(projectInfo);
      financialSummaryTable(financialSummary, marginModeling);
      summaryDeliverablesTable.initSummaryDeliverablesTable(projectResources);
      summaryOfficeTable.initSummaryOfficeTable(projectResources);
      summaryRoleTable.initSummaryRoleTable(projectResources);
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
    }
  }

  function financialSummaryTable(summary, marginModeling){

    console.log(summary);
    console.log(marginModeling);

    var ARBF = marginModeling.find(function(val){
      return val.ModelType === 'ARBF';
    });
    var SRBF = marginModeling.find(function(val){
      return val.ModelType === 'SRBF';
    });

    console.log(ARBF);
    console.log(SRBF);

    $('#total-budget').text(summary.budget);
    $('#expenses').text("$(" + summary.expenses + ")");
    $('#total-hours').text(summary.totalHours);
    $('#oop-fees').text(summary.oopFees);
    $('#avg-rate').text(summary.blendedAverage);
    $('#net-revenue').text(summary.netRevenue);
  }

  return {
    initProjectSummary: initProjectSummary
  };
})($);