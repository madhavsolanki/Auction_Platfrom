

export const catchAsyncErrors = (theFunction) => {
  return (req, resizeBy, next) => {
    Promise.resolve(theFunction(req, resizeBy, next)).catch(next);
  };
};