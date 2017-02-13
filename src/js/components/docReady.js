
(function ($) {
  $(function () {
    var path = window.location.pathname;
    path = path.split("/");

    progressNav.initProgressNav('#progress-navigation');

    validateDurationPlanBy.initValidateDurationPlanBy();
    if ('projectGeneral.html' === path[1]) {
      //calendars
      $(".datepicker").datepicker({
        "nextText": "",
        "prevText": "",
        "dateFormat": "MM dd, yy",
        onSelect: function (dateText, instance) {
          projectDuration.initProjectDuration('form.project-info', instance, dateText);
          floatLabel.initfloatLabel();
          validateDurationPlanBy.initValidateDurationPlanBy();
        }
      });
    }
    if($('form.form-edit-profile').length > 0) {
      fillForm.initFillForm('.form-edit-profile');
    }
    /**
     * Landing page
     */
    if ('index.html' === path[1] || '' === path[1]) {

      activeTableFunction.initActiveTable();

      //Show Hide elements
      showHide.initShowHide();
    }

    /**
     * Project create/edit page
     */
    if ('projectGeneral.html' === path[1]) {

      //if form to be loaded exists.
      if($("form.project-info").length > 0) {
        projectInfoForm.initProjectInfoForm(feeds);
        floatLabel.initfloatLabel();
         addRemoveFields.initAddRemoveFields('form.project-info');
      }
    }

    /**
     * Profile page
     */
    if ('profile.html' === path[1]) {
      editProfileForm.initEditProfileForm('form.form-edit-profile');
    }

    //upload CSV per the user
    if ('profile.html' === path[1] || 'projectResources.html' == path[1]) {
      loadCustomBillSheet.initLoadCustomBillSheet();
    }

    /**
     * Resources page
     */
    if ('projectResources.html' === path[1]) {
      projectResourceTable.initProjectResourceTable();
      //modeling table highlight headers on radio click
      $('#modeling-table input[type="radio"]').activateElement();
      $('.project-resources button[type="reset"]').clearAll();
    }

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

    /**
     * Resources page
     */
    if ('projectExpenses.html' == path[1]) {
      expenseTable.initExpenseTable();
      $('.project-expense button[type="reset"]').clearAll();
    }

    //print buttons
    $('.fa-print').click(function() {
      window.print();
    });

  });

}( jQuery ));
