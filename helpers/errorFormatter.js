module.exports.vErrorFormatter = (err) => {
  let eFormat = {};
  for (props in err) eFormat[props] = err[props].message;
  return eFormat;
};

module.exports.mValidatorError = (err) => {
  vError = {};
  for (field in err) {
    vError[field] = err[field].message;
  }
  return vError;
};
