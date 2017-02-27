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

    Promise.all([p1, p2, p3, p4]).then(function (values) {
      //deliverables
      var projectInfo = values[0];
      var projectDeliverables = values[1];
      var marginModeling = values[2];
      var rateCard = values[3];

      fillProjectInfoSummary(projectInfo);
      summaryDeliverablesTable.initSummaryDeliverablesTable(projectDeliverables);
      summaryOfficeTable.initSummaryOfficeTable(rateCard);
      summaryRoleTable.initSummaryRoleTable(rateCard);
    });
  }

  function fillProjectInfoSummary(projectInfo){
    var project = projectInfo.filter(function(project){
      return project.Projid === projectId;
    });

    if(project.length){
      project = project.pop();
    }
    console.log(project);
    if(project.length > 0) {
      $('#client-name').text(project.Clientname);
      $('#country').text(project.Region);
      $('#office').text(project.Office);
      $('#project-name').text(project.Projname);
      $('#start-date').text(calcPrettyDate(project.EstStDate));
      $('#duration').text(project.Duration);
      $('#comp-type').text(project.Comptyp);
    }

  }

  return {
    initProjectSummary: initProjectSummary
  };
})($);