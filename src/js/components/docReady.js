
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
      profileInfo.initProfileInfo(feeds);
    }
    /**
     * Landing page
     */
    if ('index.htm' === current_page || '' === current_page) {
      activeTableFunction.initActiveTable();
      floatLabel.initfloatLabel();
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

    //upload CSV per the user
    if ('customBillSheet.htm' === current_page) {
      loadCustomBillSheet.initLoadCustomBillSheet();
      error('#csv-table');
    }
    /**
     * Resources page
     */
    if ('projectResources.htm' === current_page) {
      projectResourceTable.initProjectResourceTable();
      //modeling table highlight headers on radio click
      $('#modeling-table input[type="radio"]').activateElement();
      $('.project-resources button[type="reset"]').clearAll();
      error('#project-resource-table');
      error('#modeling-table');
    }
    /**
     * Resources page
     */
    if ('projectExpenses.htm' === current_page) {
      expenseTable.initExpenseTable();
      $('.project-expense button[type="reset"]').clearAll();
      error('#project-expense-table');
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
    $('#btn-back').on('click', function(){
      window.history.back();
      return false;
    });

  });

}( jQuery ));
