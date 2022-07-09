const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connection = require("../../database");
const { createResponse } = require("../../response/response");
require("dotenv").config();

const userLoginHandler = async (event, context, callback) => {
  try {
    //get email and password from request body
    const { email, password } = JSON.parse(event.body);

    //promise to check if email exists
    const checkEmail = new Promise((resolve, reject) => {
      connection.getConnection((error, connections) => {
        if (error) throw error;
        connections.query(
          `SELECT * FROM User WHERE email = '${email}'`,
          function (err, result, fields) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
            connections.destroy();
          }
        );
      });
    });

    //execute promise
    const checkEmailResult = await checkEmail;

    //check if email exists
    if (checkEmailResult.length > 0) {
      let hashedPassword = checkEmailResult[0].password;

      //compare password with bcrypt
      const comparePassword = await bcrypt.compare(password, hashedPassword);

      //get userId
      const userId = checkEmailResult[0].ID;

      //generate jwt token if password matches
      if (comparePassword) {
        const token = jwt.sign(
          {
            userId: userId,
          },
          "process.env.JWT_SECRET",
          { expiresIn: "365d" }
        );

        return callback(
          null,
          createResponse(200, {
            status: true,
            message: "User logged in successfully",
            userId: userId,
            token: token,
          })
        );
      }
      //password does not match
      else {
        return callback(
          null,
          createResponse(401, {
            status: false,
            message: "Password does not match",
          })
        );
      }
    }
    //password does not match
    else {
      //email does not exist
      return callback(
        null,
        createResponse(400, {
          status: false,
          message: "Email does not exist",
        })
      );
    }
  } catch (err) {
    return callback(
      null,
      createResponse(400, {
        status: false,
        message: err,
      })
    );
  }
};

module.exports = userLoginHandler;
