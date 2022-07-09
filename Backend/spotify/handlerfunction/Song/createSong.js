const jwt = require("jsonwebtoken");
const connection = require("../../database");
const { createResponse } = require("../../response/response");

const createSongHandler = async (event, context, callback) => {
  try {
    var token = event.headers.Authorization?.split(" ")[1];
    //get SongName, ReleaseDate, CoverUrl from request body
    const { SongName, ReleaseDate, CoverUrl, ArtistId } = JSON.parse(
      event.body
    );

    if (!token) {
      return callback(
        null,
        createResponse(401, {
          status: false,
          message: "Token Not Exist",
        })
      );
    }
    //create anchor id with uuid
    var songId = "";
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
        const verifySongFromSongName = new Promise((resolve, reject) => {
          //insert anchor into database with roleId = 1
          connection.getConnection((error, connections) => {
            if (error) throw error;
            connections.query(
              `SELECT songName FROM Song WHERE songName = "${SongName}"`,
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

        const verifySongFromSongNameAPI = await verifySongFromSongName;

        if (verifySongFromSongNameAPI) {
          return callback(
            null,
            createResponse(400, {
              status: true,
              message: "Song is Already Created",
            })
          );
        }

        //promise to create anchor
        const createSong = new Promise((resolve, reject) => {
          //insert anchor into database with roleId = 1
          connection.getConnection((error, connections) => {
            if (error) throw error;
            connections.query(
              `INSERT INTO Song (songName, releaseDate, coverUrl, addedBy, totalRating, totalRatingUser) VALUES ('${SongName}', '${ReleaseDate}', '${CoverUrl}', ${payload.userId}, 0, 0)`,
              function (err, result, fields) {
                songId = result.insertId;
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
        const createAnchorResult = await createSong;

        //promise to create anchor
        const createArtistSong = new Promise((resolve, reject) => {
          //insert anchor into database with roleId = 1
          connection.getConnection((error, connections) => {
            if (error) throw error;
            connections.query(
              `INSERT INTO ArtistSong (artistId, songId) VALUES (${ArtistId}, ${songId})`,
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

        const createAnchorSongResult = await createArtistSong;

        if (createAnchorResult && createAnchorSongResult) {
          return callback(
            null,
            createResponse(200, {
              status: true,
              message: "Song created successfully",
            })
          );
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
        message: err,
      })
    );
  }
};
module.exports = createSongHandler;
