const connection = require("../../database");
const jwt = require("jsonwebtoken");
const { createResponse } = require("../../response/response");

const createArtistHandler = async (event, context, callback) => {
  try {
    var token = event.headers.Authorization?.split(" ")[1];
    //get artistname, dob, bio from request body
    const { artistname, dob, bio } = JSON.parse(event.body);

    if (!token) {
      return callback(
        null,
        createResponse(401, {
          status: false,
          message: "Token Not Exist",
        })
      );
    }

    await jwt.verify(token, "process.env.JWT_SECRET", async (err, payload) => {
      if (err) {
        return callback(
          null,
          createResponse(400, {
            status: false,
            message: err,
          })
        );
      } else {
        //promise to create anchor
        const createAnchor = new Promise((resolve, reject) => {
          //insert anchor into database with roleId = 1
          connection.getConnection((error, connections) => {
            if (error) throw error;
            connections.query(
              `INSERT INTO Artist (ArtistName, Dob, Bio) VALUES ('${artistname}', '${dob}', '${bio}')`,
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
        const createAnchorResult = await createAnchor;

        if (createAnchorResult) {
          return callback(
            null,
            createResponse(200, {
              status: true,
              message: "Artist created successfully",
            })
          );
        } else {
          return callback(
            null,
            createResponse(400, {
              status: true,
              message: "User not created",
            })
          );
        }
      }
    });
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
module.exports = createArtistHandler;
