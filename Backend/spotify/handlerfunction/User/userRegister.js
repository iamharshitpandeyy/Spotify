const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const connection = require("../../database");
const { createResponse } = require("../../response/response");
const uuid = require("uuid");

const userRegisterHandler = async (event, context, callback) => {
  try {
    //get username, email, password from request body
    const { username, email, password } = JSON.parse(event.body);

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
      return callback(
        null,
        createResponse(400, {
          status: false,
          message: "User already exists",
        })
      );
    }
    //else create anchor
    else {
      //create anchor id with uuid
      const UserId = uuid.v4();

      //promise to create anchor
      const createAnchor = new Promise((resolve, reject) => {
        // hash password
        bcryptjs.hash(password, 10, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            //insert anchor into database with roleId = 1
            connection.getConnection((error, connections) => {
              if (error) throw error;
              connections.query(
                `INSERT INTO User (ID, username, email, password) VALUES ('${UserId}', '${username}', '${email}', '${hash}')`,
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
          }
        });
      });

      //execute promise
      const createAnchorResult = await createAnchor;

      if (createAnchorResult) {
        //generate token with anchor id, role id, and expiration 365 days
        const token = jwt.sign(
          {
            userId: UserId,
          },
          "process.env.JWT_SECRET",
          { expiresIn: "365d" }
        );

        return callback(
          null,
          createResponse(200, {
            status: true,
            message: "User created successfully",
            token: token,
          })
        );
      } else {
        return callback(
          null,
          createResponse(400, {
            status: false,
            message: "User not created",
          })
        );
      }
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
module.exports = userRegisterHandler;
