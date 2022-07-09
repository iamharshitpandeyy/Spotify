"use strict";
// Artist API
const createArtistHandler = require("./handlerfunction/Artist/createArtist");
const fetchArtistHandler = require("./handlerfunction/Artist/fetchArtist");
const fetchAllArtistHandler = require("./handlerfunction/Artist/fetchAllArtist");

// User API
const userLoginHandler = require("./handlerfunction/User/userLogin");
const userRegisterHandler = require("./handlerfunction/User/userRegister");

//Song API
const createSongHandler = require("./handlerfunction/Song/createSong");
const fetchSongHandler = require("./handlerfunction/Song/fetchSong");
const searchSongHandler = require("./handlerfunction/Song/searchSong");

//rating API
const ratingSongHandler = require("./handlerfunction/Rating/ratingSong");

module.exports.createArtist = async (event, context, callback) => {
  await createArtistHandler(event, context, callback);
};

module.exports.fetchArtist = async (event, context, callback) => {
  await fetchArtistHandler(event, context, callback);
};

module.exports.fetchAllArtist = async (event, context, callback) => {
  await fetchAllArtistHandler(event, context, callback);
};

module.exports.userLogin = async (event, context, callback) => {
  await userLoginHandler(event, context, callback);
};

module.exports.userRegister = async (event, context, callback) => {
  await userRegisterHandler(event, context, callback);
};

module.exports.createSong = async (event, context, callback) => {
  await createSongHandler(event, context, callback);
};

module.exports.fetchSong = async (event, context, callback) => {
  await fetchSongHandler(event, context, callback);
};

module.exports.ratingSong = async (event, context, callback) => {
  await ratingSongHandler(event, context, callback);
};

module.exports.searchSong = async (event, context, callback) => {
  await searchSongHandler(event, context, callback);
};
