/**
 * @module Generates a Unique ID
 * @version
 */
function fetchToken() {
  if (is_fiori()) {
    $.ajax({
      method: "GET",
      url: "/sap/opu/odata/sap/ZUX_PCT_SRV/$metadata?" + getTimestamp(),
      beforeSend: function (request) {
        request.setRequestHeader("X-CSRF-Token", "Fetch");
      }
    }).then(function (data, status, xhr) {
      var token = xhr.getResponseHeader("X-CSRF-Token");
      console.log(xhr.getResponseHeader("X-CSRF-Token"));
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': token
        }
      });
    });
  }
  else{
    console.log('running in local dev, so setting fake token for testing.');
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': 'faketoken'
      }
    });
  }
}