/**
* @module Gets the correct Margin Model based on the order...
* @version
*/

function getMarginModel(marginModeling){
  if(marginModeling.length === 0){
    return null;
  };

  var selectedModel = marginModeling.find(function (val) {
    return val.Selected === '1';
  });

  if(selectedModel.ModelType !== 'FFT' && selectedModel.ModelType !== 'TMBF'){
    // apply either the ARBF or SRBF
    if(selectedModel.ModelType === 'SRBF'){
      // return SRBF model instead
      var arbfModel = marginModeling.find(function (val) {
        return val.ModelType === 'ARBF';
      });

      if(parseFloat(arbfModel.Fees) > 0){
        selectedModel = arbfModel;
      }
    }
  }

  return selectedModel;
}
