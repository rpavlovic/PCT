/**
* @module Ajax Batch Functionality
* @version
*/

function ajaxBatch(payloads, windowTargetUrl){
  $.ajaxBatch({
    url: '/sap/opu/odata/sap/ZUX_PCT_SRV/$batch',
    data: payloads,
    complete: function (xhr, status, data) {
      var timeout = getParameterByName('timeout');
      console.log("navigating to new window in" + timeout + "seconds");
      timeout = timeout ? timeout : 1;
      if(status !== 'error') {
        // no error, let's proceed
        setTimeout(function () {
          window.location.href = windowTargetUrl;
        }, timeout);
      }
      else {
        if(is_fiori()) {
          alert('an error occurred, and your changes were not saved. You may have to log out and clear cache.');
        }
        else {
          // we're on local, so go ahead and go to next page
          setTimeout(function () {
            window.location.href = windowTargetUrl;
          }, timeout);
        }
      }
    }
  });
}