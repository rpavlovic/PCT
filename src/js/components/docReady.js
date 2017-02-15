
(function ($) {
  $(function () {
    var path = window.location.pathname;
    path = path.split("/");

    // app on Fiori lives in sub-directories
    var current_page = path[path.length-1];

    // remove query string
    if (current_page.indexOf('?') != -1) {
      current_page = current_page.substring(0, current_page.indexOf('?'));
    }

    progressNav.initProgressNav('#progress-navigation');

    validateDurationPlanBy.initValidateDurationPlanBy();

    if ('projectGeneral.html' === current_page) {
      //calendars
      $(".datepicker").datepicker({
        "nextText": "",
        "prevText": "",
        "dateFormat": "MM dd, yy",
        "buttonText": "",
        "showOn": "both",
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
    if ('index.html' == current_page || '' == current_page) {

      activeTableFunction.initActiveTable();

      //Show Hide elements
      showHide.initShowHide();
    }

    /**
     * Project create/edit page
     */

    if ('projectGeneral.html' == current_page) {

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

    if ('profile.html' == current_page) {
      editProfileForm.initEditProfileForm('form.form-edit-profile');
    }

    //upload CSV per the user
    if ('customBillSheet.html' == current_page) {
      loadCustomBillSheet.initLoadCustomBillSheet();
    }

    /**
     * Resources page
     */
    if ('projectResources.html' == current_page) {
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
    if ('projectExpenses.html' == current_page) {
      expenseTable.initExpenseTable();
      $('.project-expense button[type="reset"]').clearAll();
    }

    /**
     * Summary page
     */
    if ('projectSummary.html' === current_page) {
      projectSummary.initProjectSummary();
    }

    //print buttons
    $('.fa-print').click(function() {
      window.print();
    });

  });

}( jQuery ));
