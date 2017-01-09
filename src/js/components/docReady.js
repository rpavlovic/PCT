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

    activeTable.initActiveTable();

    //upload CSV for the user
    loadCustomBillSheet.initLoadCustomBillSheet();

    projectResourceTable.initProjectResourceTable();

    //modeling table highlight headers on radio click
    $('.modeling-table input[type="radio"]').activateElement();
    $('button').activateElement();

    captureEditTd.initCaptureEditTd('#project-resource-table');

  });

}( jQuery ));
