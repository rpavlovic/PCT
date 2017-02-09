// global list of data feeds
var feeds = {
  'offices': [ 'data/OfficeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/OfficeCollection' ],
  'employee': [ 'data/EmployeeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/EmployeeCollection' ],
  'projectList': [ 'data/ProjectInfoCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection?$format=json' ],
  'project': [ 'data/ProjectInfoCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection?$filter=Projid eq \'{token}\'&$format=json' ],
  'jobSearch': [ 'data/JobSearchCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/JobNumberCollection/?$filter=SearchString eq \'{token}\'&$format=json' ],

  // Rate Card / Bill Rate / Job Title by Office name, e.g.:  get_data_feed('rateCards', 'US02')
  'rateCards': [ 'data/RateCardBillRateCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/RateCardCollection/?$filter=Plant eq \'{token}\'&$format=json' ],

  // Project Deliverables by Project ID, e.g.:  get_data_feed('projectDeliverables', '100100')
  'projectDeliverables': [ 'data/ProjectRelatedDeliverables.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection?$filter=Projid eq \'{token}\'&$format=json' ],

  // Project Resources by Project ID and Row Count, e.g.:  get_data_feed('projectResources', '100100', 1)
  'projectResources': [ 'data/ProjectResourcesCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectResourcesCollection?$filter=Projid eq \'{token}\' and Rowno eq \'{count}\'&$format=json' ],

  // TODO: make dynamic
  'plannedHours': [ 'data/PlannedHours.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/PlannedHoursSet?$filter=Projid eq \'1000103\' and Rowno eq \'001\' and Plantyp eq \'WK\' and Cellid eq \'R1\'&$format=json' ],

  // Project Expenses by Project ID, e.g.:  get_data_feed('projectExpenses', '100100')
  'projectExpenses': [ 'data/ProjectExpensesCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectExpensesCollection/?$filter=Projid eq \'{token}\'&$format=json' ]
};

/**
 * Returns static JSON if local; SAP endpoint, otherwise
 * @param {String} key name of feed to return data for
 * @param {String} query string to be used for SAP endpoint
 * @return {String|NULL} local filename; SAP endpoint (or NULL)
 */
function get_data_feed(feed, query, count) {
  var json = null;

  // typically the Project ID
  if(typeof query == 'undefined') {
    query = false;
  }

  // Row count for Resources
  if(typeof count == 'undefined') {
    count = 1;
  }

  if ($.isArray(feed)) {
    if (location.href.indexOf('localhost') != -1 || location.href.indexOf('10.211.55.2') != -1) {
      json = feed[0];
    }
    else {
      json = feed[1].replace('{token}', query);
      json = feed[1].replace('{count}', count);
    }
  }
  return json;
}

(function ($) {
  $(function () {
    var path = window.location.pathname;
    path = path.split("/");

    //if form to be loaded exists.
    if($("form.project-info").length > 0) {
      projectInfoForm.initProjectInfoForm(feeds);
        floatLabel.initfloatLabel();
    }
    //Show Hide elements
    showHide.initShowHide();

    //floating label in the input fields.
   // floatLabel.initfloatLabel();
   if($('form.project-info').length) {
    addRemoveFields.initAddRemoveFields('form.project-info');
   }

    progressNav.initProgressNav('#progress-navigation');

    validateDurationPlanBy.initValidateDurationPlanBy();

    //calendars
    $( ".datepicker" ).datepicker({
      "nextText": "",
      "prevText":"",
      "dateFormat": "MM dd, yy",
      onSelect: function(dateText, instance) {
        projectDuration.initProjectDuration('form.project-info', instance, dateText);
        floatLabel.initfloatLabel();
        validateDurationPlanBy.initValidateDurationPlanBy();
      }
    });
    // if($('form.login').length > 0) {
    //   fillForm.initFillForm('.login');
    // }
    // if($('form.register').length > 0) {
    //   fillForm.initFillForm('.register');
    // }
    // if($('form.forgotpassword').length > 0) {
    //   fillForm.initFillForm('.forgotpassword');
    // }

    if($('form.form-edit-profile').length > 0) {
      fillForm.initFillForm('.form-edit-profile');
    }

    //show in-place form.
    editProfileForm.initEditProfileForm('form.form-edit-profile');

    //Active Projects on Projects General page.
    activeTableFunction.initActiveTable();

    //upload CSV per the user
    loadCustomBillSheet.initLoadCustomBillSheet();

    projectResourceTable.initProjectResourceTable();


    //modeling table highlight headers on radio click
    $('#modeling-table input[type="radio"]').activateElement();

    var tables = {
      'customerBillTbl': '#csv-table',
      'resourceProjectTbl': '#project-resource-table',
      'expenseTbl' : '#project-expense-table',
      'modelingTable': '#modeling-table'
    };
    //get the value of table cells for validation and calculations.
    $.each(tables, function(index, el) {
      captureEditTd.initCaptureEditTd(el);
    });

    expenseTable.initExpenseTable();

    $('.project-expense button[type="reset"], .project-resources button[type="reset"]').clearAll();

    //print buttons
    $('.fa-print').click(function() {
      window.print();
    });
  });

}( jQuery ));
