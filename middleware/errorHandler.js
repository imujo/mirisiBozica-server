const errorHandler = (error, request, response, next) => {
  console.log("\n\n");
  console.error(`ERROR - ${error.message}`);
  console.log("\n\n");

  // const status = error.status || 400;
  response.status(400).json(error);
  next();
};

module.exports = errorHandler;
