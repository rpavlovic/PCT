/**
 * @module Returns appropriate promises that does the GetJSON stuff.
 * @version
 */

function getProjectInfo(projectId) {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.project, projectId), function (projects) {
      resolve(projects.d.results.find(filterByProjectId, projectId));
    }).fail(function () {
      resolve([]);
    });
  });
}

function getProjectDeliverables(projectId) {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.projectDeliverables, projectId), function (projectDeliverables) {
      resolve(projectDeliverables.d.results.filter(filterByProjectId, projectId));
    }).fail(function () {
      // not found, but lets fix this and return empty set
      console.log('no project deliverables found... returning empty set');
      resolve([]);
    });
  });
}

function getMarginModeling(projectId) {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.marginModeling, projectId, ' '), function (marginModeling) {
      resolve(marginModeling.d.results.filter(filterByProjectId, projectId));
    }).fail(function () {
      // not found, but lets fix this and return empty set
      console.log('no margin modeling found... returning empty set');
      resolve([]);
    });
  });
}

function getProjectResources(projectId) {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.projectResources, projectId), function (projectResources) {
      resolve(projectResources.d.results.filter(filterByProjectId, projectId));
    }).fail(function () {
      // not found, but lets fix this and return empty set
      console.log('no project resources found... returning empty set');
      resolve([]);
    });
  });
}

function getProjectExpenses(projectId) {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.projectExpenses, projectId), function (projectExpenses) {
      resolve(projectExpenses.d.results.filter(filterByProjectId, projectId));
    });
  });
}

function getOffices() {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.offices), function (offices) {
      var sortedOffices = offices.d.results.sort(function (a, b) {
        return (a.OfficeName > b.OfficeName) ? 1 : ((b.OfficeName > a.OfficeName) ? -1 : 0);
      });
      resolve(sortedOffices);
    }).fail(function () {
      // not found, but lets fix this and return empty set
      console.log('no offices found... returning empty set');
      resolve([]);
    });
  });
}

function getProjectList() {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.projectList), function (projects) {
      resolve(projects.d.results);
    }).fail(function () {
      // not found, but lets fix this and return empty set
      console.log('no projects found... returning empty set');
      resolve([]);
    });
  });
}

function getEmployeeInfo() {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.employee), function (employees) {
      resolve(employees.d.results[0]);
    });
  });
}

function getPlannedHours(projectId) {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.plannedHours, projectId), function (plan) {
      var ph = plan.d.results.filter(filterByProjectId, projectId);
      resolve(ph);
    }).fail(function () {
      // not found, but lets fix this and return empty set
      console.log('no planned hours found... returning empty set');
      resolve([]);
    });
  });
}

function getBillSheet(cardId) {
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.billSheet, cardId), function (cards) {
      var cardResults = cards.d.results;
      if (cardId === ' ') {
        resolve(cardResults);
      }
      else {
        cardResults = cardResults.filter(function (val) {
          return val.BillsheetId === cardId;
        });
        resolve(cardResults);
      }
    }).fail(function () {
      // not found, but lets fix this and return empty set
      console.log('no custom bill sheet found... returning empty set');
      resolve([]);
    });
  });
}

function getRateCard(officeId, currency) {
  if(!currency) {
    currency = ' ';
  }
  
  return new Promise(function (resolve, reject) {
    $.getJSON(get_data_feed(feeds.rateCards, officeId, currency), function (rcs) {
      var rateCards = rcs.d.results.filter(function (rc) {
        return parseInt(rc.CostRate) > 0 && rc.Office === officeId && rc.EmpGradeName;
      });
      resolve(rateCards);
    }).fail(function () {
      // not found, but lets fix this and return empty set
      console.log('no rate card found... returning empty set');
      resolve([]);
    });
  });
}

function getRateCardLocal(OfficeId, Currency) {
  if (!OfficeId || !Currency) {
    return [];
  }
  var rc = sessionStorage.getItem('RateCard' + OfficeId + 'Currency' + Currency);
  if (rc) {
    return JSON.parse(rc);
  } else {
    return [];
  }
}