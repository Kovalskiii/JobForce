const serviceHeader = (controller) => (req, res, next) => {
  res.set('Controller', controller);
  next();
};

export default serviceHeader;
