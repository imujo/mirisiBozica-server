const errorHandler = (error, request, response, next) => {
  console.log("\n");
  console.error(`ERROR - ${error.message}`);
  console.log("\n");

  if (error.name == "ValidationError") {
    const data = {};
    error.details.forEach((detail) => (data[detail.path[0]] = detail.message));
    return response.status(400).json({ type: "ValidationError", data: data });
  }

  // const status = error.status || 400;
  response.status(400).json({ type: "UnknownError", data: error });
  next();
};

module.exports = errorHandler;
