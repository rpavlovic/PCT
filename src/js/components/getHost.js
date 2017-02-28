/**
 * @module gets hostname
 * @version
 */
function getHost() {
  if (!is_fiori()) {
    return 'https://fioridev.interpublic.com';
  }

  var protocol = location.protocol;
  var slashes = protocol.concat("//");
  return slashes.concat(window.location.hostname);
}