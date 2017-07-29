/**
 * @module Ajax Batch Functionality
 * @param {Array} payloads: array of JSON payload(s)
 * @param {String} windowTargetUrl: URL of next page
 * @param {Boolean} continueBtn: optional param indicating whether request came from a "continue on to next page" button
 */

function ajaxBatch(payloads, windowTargetUrl, continueBtn) {
  showLoader();
  if (payloads.length === 0) {
    // no payload, so just go to target page
    window.location.href = windowTargetUrl;
  }
  else {
    $.ajaxBatch({
      url: '/sap/opu/odata/sap/ZUX_PCT_SRV/$batch',
      data: payloads,
      complete: function (xhr, status, data) {
        var timeout = getParameterByName('timeout');
        timeout = timeout ? timeout : 1;
        console.log("navigating to new window in" + timeout + "seconds");

        hideLoader();
        if (status !== 'error' && xhr.status === 202 && -1 === xhr.responseText.indexOf("HTTP/1.1 400 Bad Request")) {
          // no error, let's proceed
          if(continueBtn) {
            setTimeout(function () {
              window.location.href = windowTargetUrl;
            }, timeout);
          }
        }
        else {
          if (is_fiori()) {
            alert('an error occurred, and your changes were not saved. You may have to log out and clear cache.');
            console.log(xhr);
            console.log(status);
            console.log(data);
          }
          else {
            // we're on local, so go ahead and go to next page
            if(continueBtn) {
              setTimeout(function () {
                window.location.href = windowTargetUrl;
              }, timeout);
            }
          }
        }
      }
    });
  }
}