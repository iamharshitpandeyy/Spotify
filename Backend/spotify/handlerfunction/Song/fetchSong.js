const connection = require("../../database");
const { createResponse } = require("../../response/response");
const jwt = require("jsonwebtoken");

const fetchSongHandler = async (event, context, callback) => {
  try {
    var token = event.headers.Authorization?.split(" ")[1];
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
        // Counting Failed KYC Status
        const getFetchSong = new Promise((resolve, reject) => {
          connection.getConnection((error, connections) => {
            if (error) throw error;
            connections.query(
              `select Song.ID, Song.songName, Song.releaseDate, Song.coverUrl, Song.totalRating, Song.totalRatingUser, Artist.ArtistName 
              from ArtistSong
              LEFT JOIN Song on ArtistSong.songId = Song.ID
              LEFT JOIN Artist on ArtistSong.artistId = Artist.ID`,
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

module.exports = fetchSongHandler;
