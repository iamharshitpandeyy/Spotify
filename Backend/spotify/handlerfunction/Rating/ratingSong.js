const connection = require("../../database");
const jwt = require("jsonwebtoken");
const { createResponse } = require("../../response/response");

const ratingSongHandler = async (event, context, callback) => {
  try {
    var token = event.headers.Authorization?.split(" ")[1];
    const { songid } = event.pathParameters;
    const { rating } = JSON.parse(event.body);

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
        const getSongDetails = new Promise((resolve, reject) => {
          //insert anchor into database with roleId = 1
          connection.getConnection((error, connections) => {
            if (error) throw error;
            connections.query(
              `SELECT * FROM Song WHERE ID=${songid}`,
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
        const getSongResult = await getSongDetails;

        if (getSongResult) {
          const getSongAvgRating = new Promise((resolve, reject) => {
            //insert anchor into database with roleId = 1
            connection.getConnection((error, connections) => {
              if (error) throw error;
              connections.query(
                `SELECT AVG(rating) as avgrating FROM Rating WHERE songId=${songid}`,
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
          const getSongRatingResult = await getSongAvgRating;

          const StoreRating = new Promise((resolve, reject) => {
            //insert anchor into database with roleId = 1
            connection.getConnection((error, connections) => {
              if (error) throw error;
              connections.query(
                `INSERT INTO Rating (rating, userId, songId) VALUES ('${rating}',${payload.userId},${songid})`,
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
          const storeSongRatingResult = await StoreRating;

          if (getSongRatingResult[0].avgrating !== null) {
            const lengthofRating = getSongResult[0].totalRatingUser;
            const totalRating =
              (getSongRatingResult[0].avgrating + rating) /
              (lengthofRating + 1);

            const storeAvgratinginSong = new Promise((resolve, reject) => {
              //insert anchor into database with roleId = 1
              connection.getConnection((error, connections) => {
                if (error) throw error;
                connections.query(
                  `UPDATE Song
                    SET totalRating=${totalRating}, totalRatingUser='${
                    Number(lengthofRating) + 1
                  }'
                    WHERE ID=${songid}`,
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
            const SongRatingResult = await storeAvgratinginSong;
            if (SongRatingResult) {
              return callback(
                null,
                createResponse(200, {
                  status: true,
                  message: "Thank you for rating",
                })
              );
            } else {
              return callback(
                null,
                createResponse(400, {
                  status: false,
                  message: "Retry rating to song",
                })
              );
            }
          } else {
            const storeAvgratinginSong = new Promise((resolve, reject) => {
              //insert anchor into database with roleId = 1
              connection.getConnection((error, connections) => {
                if (error) throw error;
                connections.query(
                  `UPDATE Song
                SET totalRating=${rating}, totalRatingUser='1'
                WHERE ID=${songid}`,
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
            const SongRatingResult = await storeAvgratinginSong;
            if (SongRatingResult) {
              return callback(
                null,
                createResponse(200, {
                  status: false,
                  message: "Thank you for rating",
                })
              );
            } else {
              return callback(
                null,
                createResponse(400, {
                  status: false,
                  message: "Retry rating to song",
                })
              );
            }
          }
        } else {
          return callback(
            null,
            createResponse(400, {
              status: false,
              message: "Song not created",
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
module.exports = ratingSongHandler;
