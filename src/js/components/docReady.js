(function ($) {
  $(function () {
    var path = window.location.pathname;

    //TODO check what pages to load what json
    if(path != '/') {
      loadJSON.initJSON("/data/gw_client_data.json");
     }

    //Get started button show tabs to sign in or register
    showLogin.initLoginTabs();

    //Enbale submit when fileds are filled.
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
    //show inplace form
    editProfileForm.initEditProfileForm('form.form-edit-profile');

  });

})(jQuery);
