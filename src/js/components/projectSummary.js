/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectSummary = (function ($) {
  'use strict';

  function initProjectSummary() {
    var p1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.project, getParameterByName('projID')), function (projects) {
        resolve(projects.d.results);
      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectDeliverables), function (projectDeliverables) {
        resolve(projectDeliverables.d.results);
      });
    });

    var p3 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.marginModeling, getParameterByName('projID'), 'SRGF'), function (marginModeling) {
        resolve(marginModeling.d.results);
      });
    });

    Promise.all([p1, p2, p3]).then(function (values) {
      //deliverables
      var project = values[0];
      var projectDeliverables = values[1];
      var marginModeling = values[2];

      console.log("project");
      console.log(project);
      console.log("deliverables");
      console.log(projectDeliverables);
      console.log("mm");
      console.log(marginModeling);
      summaryDelivTable.initSummaryDelivTable(projectDeliverables);
    });
  }

  return {
    initProjectSummary: initProjectSummary
  };
})($);