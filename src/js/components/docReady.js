// global list of data feeds
var feeds = {
  'offices': [ 'data/OfficeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/OfficeCollection' ],
  'employee': [ 'data/EmployeeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/EmployeeCollection' ],
  'jobSearch': [ 'data/JobSearchCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/JobNumberCollection/?$filter=SearchString eq \'\'&$format=json' ],
  'expenses': [ 'data/expenses.json', null ]
};

function get_data_feed(feed) {
  if (location.href.indexOf('localhost') != -1) {
    return feed[0];
  }
  return feed[1];
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
