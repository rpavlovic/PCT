/**
* @module just a simple filter to match the project ids
* @version
*/
function matchProjID(value){
  return value.Projid === getParameterByName('projID');
}
