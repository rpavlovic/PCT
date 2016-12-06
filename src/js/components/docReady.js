(function ($) {
  $(function () {
    var path = window.location.pathname;
    path = path.split("/");

    //TODO check what pages to load what json
    if(path[3] === 'projects.html') {
      loadJSON.initJSON("/data/gw_client_data.json");
    }
    if(path[3] === 'profile.html') {
     loadJSON.initJSON("/data/profile.json");
    }
    //Get started button show tabs to sign in or register
    showLogin.initLoginTabs();

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
    //calendars
    $( ".datepicker" ).datepicker();

    addRemoveFields.initAddRemoveFields('.project-info');

    progressNav.initProgressNav('#progress-navigation');
  });

})(jQuery);
