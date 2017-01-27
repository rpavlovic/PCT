// global list of data feeds
var feeds = {
  'offices': [ 'data/OfficeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/OfficeCollection' ],
  'employee': [ 'data/EmployeeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/EmployeeCollection' ],
  'project': [ 'data/ProjectInfoCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection?$filter=Projid eq \'{token}\'&$format=json' ],
  'jobSearch': [ 'data/JobSearchCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/JobNumberCollection/?$filter=SearchString eq \'{token}\'&$format=json' ],
  'customerSearch': [ 'data/CustomerCollectionByOffice.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/CustomerCollection/?$filter=Office eq \'{token}\'&$format=json' ],

  // default rate card by selected office (e.g. 'US01'):
  'rateCards': [ 'data/RateCardBillRateCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/RateCardCollection/?$filter=Plant eq \'{token}\'&$format=json' ],
  'projectDeliverables': [ 'data/ProjectRelatedDeliverables.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection?$format=json' ]
};

/**
 * Returns static JSON if local; SAP endpoint, otherwise
 * @param {String} key name of feed to return data for
 * @param {String} query string to be used for SAP endpoint
 * @return {String|NULL} local filename; SAP endpoint (or NULL)
 */
function get_data_feed(feed, query) {
  var json = null;
  if ($.isArray(feed)) {
    if (location.href.indexOf('localhost') != -1) {
      json = feed[0];
    }
    else {
      json = feed[1].replace('{token}', query);
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
      loadJSON.initJSON(get_data_feed(feeds['offices']), get_data_feed(feeds['employee']));
    }
    //Show Hide elements
    showHide.initShowHide();

    //floating label in the input fields.
    floatLabel.initfloatLabel();

    addRemoveFields.initAddRemoveFields('.project-info');

    progressNav.initProgressNav('#progress-navigation');

    //calendars
    $( ".datepicker" ).datepicker({
      "nextText": "",
      "prevText":"",
      "dateFormat": "MM dd, yy",
      onSelect: function(dateText, instance) {
        projectDuration.initProjectDuration('.project-info', instance, dateText);
        floatLabel.initfloatLabel();
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
    activeTable.initActiveTable();

    //upload CSV per the user
    loadCustomBillSheet.initLoadCustomBillSheet();

    projectResourceTable.initProjectResourceTable();

    //modeling table highlight headers on radio click
    $('.modeling-table input[type="radio"], button').activateElement();
    // $('button').activateElement();

    var tables = {
      'customerBillTbl': '#csv-table',
      'resourceProjectTbl': '#project-resource-table',
      'expenseTbl' : '#project-expense-table',
    };
    //get the value of table cells for validation and calculations.
    $.each(tables, function(index, el) {
      captureEditTd.initCaptureEditTd(el);
    });

    expenseTable.initExpenseTable();

  $('.project-expence button[type="reset"], .project-resources button[type="reset"]').clearAll();

  //print buttons
  $('.fa-print').click(function(){
    window.print();
  });

  });

}( jQuery ));
