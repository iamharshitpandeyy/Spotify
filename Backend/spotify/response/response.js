/**
 *
 * @param {number} statusCode Status code to return default: 200
 * @param {object} payload Payload to return default: {}
 * @returns
 */
const createResponse = (statusCode, payload) => {
  return {
    statusCode: statusCode || 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers":
        "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
    },
    body: JSON.stringify(payload),
  };
};

/**
 *
 * @param {number} statusCode Status code to return default: 501
 * @param {string} message Message to return default: "An error occurred"
 * @returns
 */
const createErrorResponse = (statusCode, message) => {
  return {
    statusCode: statusCode || 501,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers":
        "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
    },
    body: JSON.stringify({
      error: message || "An error occured.",
      status: false,
    }),
  };
};

module.exports = { createResponse, createErrorResponse };
