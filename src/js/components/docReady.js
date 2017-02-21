
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

    fetchToken();
    progressNav.initProgressNav('#progress-navigation');

    validateDurationPlanBy.initValidateDurationPlanBy();

    if ('projectGeneral.htm' === current_page) {
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
    if ('index.htm' === current_page || '' === current_page) {
      activeTableFunction.initActiveTable();
      //Show Hide elements
      showHide.initShowHide();
    }

    /**
     * Project create/edit page
     */

    if ('projectGeneral.htm' === current_page) {

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

    if ('profile.htm' === current_page) {
      editProfileForm.initEditProfileForm('form.form-edit-profile');
    }

    //upload CSV per the user
    if ('customBillSheet.htm' === current_page) {
      loadCustomBillSheet.initLoadCustomBillSheet();
      captureEditTd.initCaptureEditTd('#csv-table');
    }

    /**
     * Resources page
     */
    if ('projectResources.htm' === current_page) {
      projectResourceTable.initProjectResourceTable();
      rateCardSelect.initRateCardSelect(feeds);
      //modeling table highlight headers on radio click
      $('#modeling-table input[type="radio"]').activateElement();
      $('.project-resources button[type="reset"]').clearAll();
      captureEditTd.initCaptureEditTd('#modeling-table');
      captureEditTd.initCaptureEditTd('#project-resource-table');
    }
    /**
     * Resources page
     */
    if ('projectExpenses.htm' === current_page) {
      expenseTable.initExpenseTable();
      $('.project-expense button[type="reset"]').clearAll();
    }

    /**
     * Summary page
     */
    if ('projectSummary.htm' === current_page) {
      projectSummary.initProjectSummary();
    }

    //print buttons
    $('.fa-print').click(function() {
      window.print();
    });

    //Back to previous Page function
    $('#go-back').on('click', function(){
      window.history.back();
      return false;
    });
  });

}( jQuery ));
