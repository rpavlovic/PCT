(function ($) {
  $(function () {
    var path = window.location.pathname;
    path = path.split("/");

    //TODO check what pages to load what json
    // if(path[3] === 'projects.html') {
    //   loadJSON.initJSON("/data/OfficeCollection.json");
    // }
    // if(path[3] === 'profile.html') {
    //  loadJSON.initJSON("/data/profile.json");
    // }

    //Show Hide elements
    showHide.initShowHide();

    //Enable submit when fileds are filled.
    if($('form.login').length > 0) {
      fillForm.initFillForm('.login');
    }
    if($('form.register').length > 0) {
      fillForm.initFillForm('.register');
    }
    if($('form.forgotpassword').length > 0) {
      fillForm.initFillForm('.forgotpassword');
    }
    if($('form.form-edit-profile').length > 0) {
      fillForm.initFillForm('.form-edit-profile');
    }
    //show in-place form.
    editProfileForm.initEditProfileForm('form.form-edit-profile');

    //drop-down selects and buttons.
    dropDown.initDropDown('[data-toggle]');

    //floating label in the input fields.
    floatLabel.initfloatLabel();

    addRemoveFields.initAddRemoveFields('.project-info');

    progressNav.initProgressNav('#progress-navigation');

    //calendars
    // $( ".datepicker" ).datepicker({
    //   onSelect: function(dateText, instance) {
    //     projectDuration.initProjectDuration('.project-info', instance, dateText);
    //     floatLabel.initfloatLabel();
    //   }
    // });
    projectDuration.initProjectDuration('.project-info');
    activeTable.initActiveTable();
    //upload CSV for the user
    loadCustomBillSheet.initLoadCustomBillSheet();

  });

}( jQuery ));
