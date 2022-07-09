const connection = require("../../database");
const { createResponse } = require("../../response/response");
const jwt = require("jsonwebtoken");

const searchSongHandler = async (event, context, callback) => {
  //   try {
  var token = event.headers.Authorization?.split(" ")[1];
  var { searchfield } = JSON.parse(event.body);
  if (!searchfield) {
    return callback(
      null,
      createResponse(400, {
        status: false,
        message: "Insert Search field",
      })
    );
  }
  if (!token) {
    return callback(
      null,
      createResponse(400, {
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
      // Search Song through songname
      const getFetchSong = new Promise((resolve, reject) => {
        connection.getConnection((error, connections) => {
          if (error) throw error;
          connections.query(
            `SELECT * FROM Song WHERE songName = "${searchfield}"`,
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
      const getallsongDetails = await getFetchSong;

      if (getallsongDetails) {
        return callback(
          null,
          createResponse(200, {
            status: true,
            getallsongDetails,
          })
        );
      } else {
        return callback(
          null,
          createResponse(400, {
            status: false,
            message: "Fail to load Merchant data",
          })
        );
      }
    }
  });
  //   } catch (err) {
  //     return callback(
  //       null,
  //       createResponse(400, {
  //         status: false,
  //         message: err,
  //       })
  //     );
  //   }
};

module.exports = searchSongHandler;
