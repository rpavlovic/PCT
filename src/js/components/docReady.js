(function ($) {
  $(function () {
    var path = window.location.pathname;
    path = path.split("/");

    var feeds = {
      'offices': '/data/OfficeCollection.json',
      'employee': '/data/EmployeeCollection.json'
    };
    //if form to be loaded exists.
    if($("form.project-info").length > 0) {
      loadJSON.initJSON(feeds['offices'], feeds['employee']);
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
    $('.modeling-table input[type="radio"]').activateElement();
    $('button').activateElement();

    var tables = {
      'customerBillTbl': '#csv-table',
      'resourceProjectTbl': '#project-resource-table',
      'expenceTbl' : '#project-expence-table',
    };
    captureEditTd.initCaptureEditTd(tables['customerBillTbl']);
    captureEditTd.initCaptureEditTd(tables['resourceProjectTbl']);
    captureEditTd.initCaptureEditTd(tables['expenceTbl']);

    expenceTable.initExpenceTable();

  });

}( jQuery ));
