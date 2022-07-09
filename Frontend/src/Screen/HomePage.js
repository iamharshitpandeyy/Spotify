import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ImageCard from "../components/ImageCard";
import { FETCH_SONG_API, SEARCH_SONG } from "../components/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function getAllSong() {
  if (localStorage.getItem("deltaxusertoken")) {
    return fetch(FETCH_SONG_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("deltaxusertoken")}`,
      },
    });
  }
}

function searchSongFunction(searchfield) {
  if (localStorage.getItem("deltaxusertoken")) {
    return fetch(SEARCH_SONG, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("deltaxusertoken")}`,
      },
      body: JSON.stringify({
        searchfield,
      }),
    });
  }
}

const HomePage = () => {
  const [allsong, setallSong] = useState([]);
  const [userupdated, setUserUpdated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [searchfield, setSearchField] = useState("");

  useEffect(() => {
    setIsSubmitting(true);
    console.log("data");
    async function fetchData() {
      try {
        const response = await getAllSong();
        const { status, message, getallsongDetails } = await response.json();

        if (status) {
          setallSong(getallsongDetails);
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
          toast.success(message, { autoClose: 2000 });
        }
      } catch (e) {
        setIsSubmitting(false);
      }
    }
    fetchData();
  }, [userupdated, isRating]);

  const searchSongTrigger = async () => {
    if (searchfield === "") {
      const response = await getAllSong();
      const { status, message, getallsongDetails } = await response.json();

      if (status) {
        setallSong(getallsongDetails);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        toast.success(message, { autoClose: 2000 });
      }
    } else {
      try {
        const response = await searchSongFunction(searchfield);
        const { status, message, getallsongDetails } = await response.json();
        if (status) {
          setallSong(getallsongDetails);
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
        }
      } catch (e) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="ml-10 mr-10">
      <div className="flex justify-between mt-5">
        <div className="mb-3 xl:w-96">
          <div className="input-group relative flex items-stretch w-full mb-4">
            <input
              type="search"
              className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
              onChange={(value) => setSearchField(value.target.value)}
            />
            <button
              className="btn inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
              type="button"
              id="button-addon2"
              onClick={() => searchSongTrigger()}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="search"
                className="w-4"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <Link to={"/addsong"}>
          <button className="px-4 h-11 text-white bg-blue-600 rounded-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 duration-150">
            <AddIcon /> Add Song
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4 mt-10">
        {allsong.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            isRating={isRating}
            setIsRating={setIsRating}
          />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
