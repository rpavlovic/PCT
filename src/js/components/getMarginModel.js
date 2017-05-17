/**
* @module Gets the correct Margin Model based on the order...
* @version
*/

function getMarginModel(marginModeling){
  if(marginModeling.length === 0){
    return null;
  }

  var selectedModel = marginModeling.find(function (val) {
    return val.Selected === '1';
  });

  // no model was selected, so just pick a SRBF
  if(!selectedModel){
    selectedModel = marginModeling.find(function (val) {
      return val.ModelType === 'SRBF';
    });
  }
  
  return selectedModel;
}
