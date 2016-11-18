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
    fillForm.initFillForm('form.login');
    fillForm.initFillForm('form.register');
    fillForm.initFillForm('form.forgotpassword');
  });

})(jQuery);
