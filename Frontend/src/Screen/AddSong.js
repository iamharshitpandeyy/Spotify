import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AddArtist from "../components/AddArtist";
import { CREATE_NEW_SONG_API, FETCH_ALL_ARTIST_API } from "../components/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function createSong(SongName, ReleaseDate, CoverUrl, ArtistId) {
  if (localStorage.getItem("deltaxusertoken")) {
    return fetch(CREATE_NEW_SONG_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("deltaxusertoken")}`,
      },
      body: JSON.stringify({
        SongName,
        ReleaseDate,
        CoverUrl,
        ArtistId,
      }),
    });
  }
}

function getAllArtist() {
  if (localStorage.getItem("deltaxusertoken")) {
    return fetch(FETCH_ALL_ARTIST_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("deltaxusertoken")}`,
      },
    });
  }
}

const AddSong = () => {
  const [showpopup, setshowPopUp] = useState(false);
  const [songName, setsongName] = useState("");
  const [dob, setDob] = useState("");
  const [coverletter, setCoverLetter] = useState("");
  const [artistId, setArtistId] = useState("");

  const [songNameerror, setsongNameerror] = useState(false);
  const [doberror, setDoberror] = useState(false);
  const [coverlettererror, setCoverLettererror] = useState(false);
  const [artistIderror, setArtistIderror] = useState(false);

  const [artistdata, setArtist] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(true);
    async function fetchData() {
      try {
        const response = await getAllArtist();
        const { status, artistDetail } = await response.json();

        if (status) {
          setArtist(artistDetail);
          setIsSubmitting(false);
        } else if (status === false) {
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      } catch (e) {
        setIsSubmitting(false);
      }
    }
    fetchData();
  }, [showpopup]);

  const createSongAPI = async (url) => {
    setIsSubmitting(true);
    try {
      const response = await createSong(songName, dob, url, artistId);
      const { status, message } = await response.json();
      if (status) {
        setIsSubmitting(false);
        setshowPopUp(false);
        toast.success(message, { autoClose: 2000 });
      } else {
        setIsSubmitting(false);
        toast.success(message, { autoClose: 2000 });
      }
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  const uploadImage = () => {
    if (
      songName === "" ||
      dob === "" ||
      coverletter === "" ||
      artistId === ""
    ) {
      setsongNameerror(songName === "" ? true : false);
      setDoberror(dob === "" ? true : false);
      setCoverLettererror(coverletter === "" ? true : false);
      setArtistIderror(artistId === "" ? true : false);
    } else {
      const data = new FormData();
      data.append("file", coverletter);
      data.append("upload_preset", "asqhr6fl");
      data.append("cloud_name", "harshitpandey251");

      fetch("https://api.cloudinary.com/v1_1/harshitpandey251/image/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          createSongAPI(data.url);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className="ml-20 mt-10">
        <h2 className="text-3xl mb-10 font-semibold">Add a new Song</h2>
        <form className="w-full max-w-3xl bg-white shadow-xl rounded-md py-10 px-10">
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block md:text-left mb-1 md:mb-0 pr-4"
                for="inline-full-name"
              >
                Song Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-full-name"
                type="text"
                value={songName}
                onChange={(e) => {
                  setsongName(e.target.value);
                  setsongNameerror(false);
                }}
              />
              {songNameerror !== false && (
                <label
                  className="block md:text-left text-xs"
                  style={{ color: "red" }}
                >
                  please insert song name
                </label>
              )}
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block md:text-left mb-1 md:mb-0 pr-4"
                for="inline-password"
              >
                Date Released
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className=" appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-password"
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  setDoberror(false);
                }}
              />
              {doberror !== false && (
                <label
                  className="block md:text-left text-xs"
                  style={{ color: "red" }}
                >
                  please insert date released
                </label>
              )}
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block md:text-left mb-1 md:mb-0 pr-4"
                for="inline-password"
              >
                Artwork
              </label>
            </div>
            <div className="md:w-2/3">
              <div className="w-full flex">
                <label
                  for="uploadfile"
                  className="px-7 w-1/2 py-2 bg-blue-600 rounded-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 duration-150 text-white text-center rounded cursor-pointer"
                >
                  <DriveFolderUploadIcon /> Upload Image
                </label>
                <input
                  type="file"
                  id="uploadfile"
                  accept="csv"
                  className="w-1/2"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setCoverLetter(e.target.files[0]);
                    setCoverLettererror(false);
                  }}
                />
              </div>
              <label
                className="block md:text-left mb-1 md:mb-0 pr-4 mt-2"
                for="inline-password"
              >
                {coverletter?.name}
              </label>
              {coverlettererror !== false && (
                <label
                  className="block md:text-left text-xs"
                  style={{ color: "red" }}
                >
                  please select artwork
                </label>
              )}
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block md:text-left mb-1 md:mb-0 pr-4"
                for="inline-password"
              >
                Artists
              </label>
            </div>
            <div className="md:w-2/4">
              {artistdata.length > 0 && (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={artistdata}
                  getOptionLabel={(option) => option.ArtistName}
                  sx={{ width: 300 }}
                  onChange={(event, newValue) => {
                    setArtistId(newValue?.ID);
                    setArtistIderror(false);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            </div>
            <div className="md:w-1/6">
              <div
                className="px-1.5 h-11 text-white bg-blue-600 rounded-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 duration-150 cursor-pointer"
                onClick={() => setshowPopUp(true)}
              >
                <AddIcon /> Add Artist
              </div>
            </div>
          </div>
          {artistIderror !== false && (
            <label
              className="block md:text-left text-xs"
              style={{ color: "red" }}
            >
              please select artist
            </label>
          )}

          <div className="md:flex md:items-center mt-10">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-blue-600 rounded-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 duration-150 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded"
                type="button"
                onClick={() => uploadImage()}
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
      {showpopup === true && <AddArtist setshowPopUp={setshowPopUp} />}
      <ToastContainer />
    </>
  );
};

export default AddSong;
